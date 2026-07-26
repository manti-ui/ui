/**
 * Contrast and gamut audit of the resolved Manti palette.
 *
 * Reads the REAL token values out of `src/tokens.css` via the shared reader in
 * `lib/tokens-css.mjs` (resolving `var()`, `light-dark()`, `color-mix(in oklab, …)`
 * and the `--manti-cool-hue` indirection) so the check can never drift from the
 * tokens it guards. All colorimetry is delegated to `colorjs.io`.
 *
 *   node scripts/check-contrast.mjs           # report (exit 0)
 *   node scripts/check-contrast.mjs --gate     # exit 1 if a GATE pair fails AA
 *
 * WCAG 2.1 thresholds: normal text ≥4.5 (AA), UI/non-text ≥3.0, AAA ≥7.
 * APCA Lc is reported as an indicator (≈60 body, ≈45 large, ≈75 fine text).
 * Only load-bearing pairs are gated; decorative borders / lowest-emphasis text
 * are reported as warnings (WCAG exempts decorative and disabled elements).
 * A pair whose tokens cannot be resolved fails the gate too — an unchecked pair
 * is a hole in the audit, not a pass.
 *
 * The ramps are authored in OKLCH and are wider than sRGB in places, so the
 * numbers describe the *specified* color. The GAMUT section reports which stops
 * overflow sRGB / Display-P3, and the sRGB DISPLAY section re-runs the gated
 * pairs through CSS Color 4 gamut mapping to show what an sRGB screen actually
 * resolves. Neither is gated yet — measuring first is deliberate; whether to
 * narrow the ramps is a design decision.
 *
 * `--variant-on-solid` is not audited as a taste call: `gen-variant-ink.mjs`
 * picks it by measurement and this script re-checks the result independently.
 */
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { apca, readTokensCss, toSrgb, wcag } from './lib/tokens-css.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CSS = presolve(here, '../src/tokens.css');
const gate = process.argv.includes('--gate');

const { root, variantScopes, color, resolveToken } = await readTokensCss(CSS);

// ── pairs to check ───────────────────────────────────────────────────────────
// kind: 'text' → AA 4.5 | 'ui' → 3.0.  gate: counts toward exit code.
const chrome = [
  ['text / bg', '--manti-text', '--manti-bg', 'text', true],
  ['text / surface', '--manti-text', '--manti-surface', 'text', true],
  [
    'danger-text / surface',
    '--manti-danger-text',
    '--manti-surface',
    'text',
    true,
  ],
  [
    'warning-text / surface',
    '--manti-warning-text',
    '--manti-surface',
    'text',
    true,
  ],
  [
    'text-muted / surface',
    '--manti-text-muted',
    '--manti-surface',
    'text',
    true,
  ],
  [
    'text-subtle / surface',
    '--manti-text-subtle',
    '--manti-surface',
    'text',
    true,
  ],
  ['focus-ring / bg', '--manti-focus-ring', '--manti-bg', 'ui', true],
  [
    'border-strong / surface',
    '--manti-border-strong',
    '--manti-surface',
    'ui',
    false,
  ],
  ['border / surface', '--manti-border', '--manti-surface', 'ui', false],
];
const perVariant = [
  ['on-solid / solid', '--variant-on-solid', '--variant-solid', 'text', true],
  [
    'soft-text / soft-bg',
    '--variant-soft-text',
    '--variant-soft-bg',
    'text',
    true,
  ],
];

let failures = 0;
const unresolved = [];
/** Gated pairs whose sRGB-mapped rendering lands on the other side of the bar. */
const srgbDrift = [];

function row(label, fg, bg, kind, gated, scope, group) {
  const out = [];
  for (const theme of ['light', 'dark']) {
    const a = resolveToken(fg, theme, scope),
      b = resolveToken(bg, theme, scope);
    if (a.err || b.err) {
      unresolved.push(`${label} (${theme}): ${a.err ?? b.err}`);
      if (gated) failures++;
      out.push(
        `${theme} ${'?'.padStart(5)} ${(gated ? 'FAIL' : 'warn').padEnd(4)} Lc  ?`,
      );
      continue;
    }
    const w = wcag(a.c, b.c),
      lc = apca(a.c, b.c);
    const bar = kind === 'ui' ? 3.0 : 4.5;
    const pass = w >= bar;
    if (!pass && gated) failures++;
    const tag = pass ? 'ok' : gated ? 'FAIL' : 'warn';
    out.push(
      `${theme} ${w.toFixed(2).padStart(5)} ${tag.padEnd(4)} Lc${lc.toFixed(0).padStart(3)}`,
    );

    // What the same pair resolves to once mapped into sRGB.
    const ws = wcag(toSrgb(a.c), toSrgb(b.c));
    if (gated && pass && ws < bar)
      srgbDrift.push(
        `${group} · ${label} (${theme}): ${w.toFixed(2)} spec → ${ws.toFixed(2)} on sRGB, below ${bar.toFixed(1)}`,
      );
  }
  const g = gated ? '' : '  ·warn-only';
  console.log(`  ${label.padEnd(24)} ${out.join('   ')}${g}`);
}

console.log('\nCHROME (root)');
for (const [l, fg, bg, k, g] of chrome) row(l, fg, bg, k, g, root, 'chrome');
for (const [name, scope] of variantScopes) {
  console.log(`\nVARIANT '${name}'`);
  for (const [l, fg, bg, k, g] of perVariant)
    row(l, fg, bg, k, g, scope, `variant '${name}'`);
}

// ── gamut audit of the primitive ramps ───────────────────────────────────────
// The ramps are authored in OKLCH from a chroma curve that has no gamut
// guarantee, so a stop can specify more chroma than a display can show. Report
// the overflow and how far gamut mapping moves each offender (ΔE OK).
console.log('\nGAMUT (primitive ramps)');
const stops = [];
for (const [name, value] of root) {
  const m = name.match(/^--manti-(gray|orange|green|amber|red|blue)-(\d+)$/);
  if (!m) continue;
  const c = color(value, 'light', root);
  if (c) stops.push({ id: `${m[1]}-${m[2]}`, c });
}
const outside = stops.filter((s) => !s.c.inGamut('srgb'));
for (const s of outside) {
  const p3 = s.c.inGamut('p3') ? 'in ' : 'OUT';
  const dE = s.c.deltaEOK(toSrgb(s.c));
  console.log(
    `  ${s.id.padEnd(11)} ${s.c.toString({ precision: 4 }).padEnd(30)} sRGB:out  P3:${p3}  ΔEok ${dE.toFixed(4)}`,
  );
}
const outP3 = stops.filter((s) => !s.c.inGamut('p3')).length;
console.log(
  `  ${outside.length}/${stops.length} stops outside sRGB, ${outP3} outside Display-P3.`,
);

console.log(
  `\nGate: normal text ≥4.5, UI ≥3.0 (load-bearing only). warn-only rows never fail the gate.`,
);
if (srgbDrift.length) {
  console.log(
    `\nsRGB DISPLAY — gated pairs that pass on paper but not on sRGB:`,
  );
  for (const d of srgbDrift) console.log(`  ${d}`);
  console.log(`  (reported, not gated — narrowing the ramps is a design call)`);
}
if (unresolved.length) {
  console.error(
    `\nUNRESOLVED (${unresolved.length}) — these pairs are unchecked:`,
  );
  for (const u of unresolved) console.error(`  ${u}`);
}
if (gate && failures) {
  console.error(`\n✗ ${failures} gated contrast failure(s).`);
  process.exit(1);
}
console.log(
  gate
    ? `\n✓ no gated contrast failures.`
    : `\n(report only — pass --gate to enforce)`,
);
