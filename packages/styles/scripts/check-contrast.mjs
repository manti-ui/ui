/**
 * Contrast and gamut audit of the resolved Manti palette.
 *
 * Reads the REAL token values out of `src/tokens.css` via the shared reader in
 * `lib/tokens-css.mjs` (resolving `var()`, `light-dark()` and
 * `color-mix(in oklab, …)`) so the check can never drift from the tokens it
 * guards. All colorimetry is delegated to `colorjs.io`.
 *
 *   node scripts/check-contrast.mjs           # report (exit 0)
 *   node scripts/check-contrast.mjs --gate     # exit 1 if a GATE pair fails AA
 *
 * WCAG 2.1 thresholds: normal text ≥4.5 (AA), UI/non-text ≥3.0, AAA ≥7.
 * APCA Lc is reported as an indicator (≈60 body, ≈45 large, ≈75 fine text).
 * Only load-bearing pairs Manti maps itself are gated; decorative borders and
 * the pairs whose steps Radix fixes (warning text, focus ring, the ink on a
 * solid, soft text) are reported as warnings.
 * A pair whose tokens cannot be resolved fails the gate too — an unchecked pair
 * is a hole in the audit, not a pass.
 *
 * The scales are Radix sRGB hex, so they should sit inside sRGB; a color-mix
 * or a preset color could still leave it. The GAMUT section reports which stops
 * overflow sRGB / Display-P3, and the sRGB DISPLAY section re-runs the gated
 * pairs through CSS Color 4 gamut mapping to show what an sRGB screen actually
 * resolves. Neither is gated.
 *
 * `--variant-on-solid` follows Radix's step 9 rule (`gen-variant-ink.mjs`);
 * this script reports how it measures.
 *
 * The shipped presets (`src/themes/*.css`) are audited too, each overlaid on the
 * tokens it moves, so a preset cannot ship below the contrast floor.
 */
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { apca, readTokensCss, toSrgb, wcag } from './lib/tokens-css.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CSS = presolve(here, '../src/tokens.css');
const TOKENS_TS = presolve(here, '../../tokens/src/index.ts');
const gate = process.argv.includes('--gate');

const { contrastPairs, presets } = await import(pathToFileURL(TOKENS_TS).href);
const { root, variantScopes, color, resolveToken } = await readTokensCss(CSS);

// ── pairs to check ───────────────────────────────────────────────────────────
// The pairs are the `contrastPairs` export of `@manti-ui/tokens`, so an app that
// themes Manti checks the same list. kind: 'text' → AA 4.5 | 'ui' → 3.0.
// gate: counts toward exit code. scope: 'root' | 'variant' (every variant).
const chrome = contrastPairs.filter((p) => p.scope === 'root');
const perVariant = contrastPairs.filter((p) => p.scope === 'variant');

let failures = 0;
const unresolved = [];
/** Gated pairs whose sRGB-mapped rendering lands on the other side of the bar. */
const srgbDrift = [];

function row(label, fg, bg, kind, gated, scope, group, resolve = resolveToken) {
  const out = [];
  for (const theme of ['light', 'dark']) {
    const a = resolve(fg, theme, scope),
      b = resolve(bg, theme, scope);
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
for (const { label, fg, bg, kind, gate: g } of chrome)
  row(label, fg, bg, kind, g, root, 'chrome');
for (const [name, scope] of variantScopes) {
  console.log(`\nVARIANT '${name}'`);
  for (const { label, fg, bg, kind, gate: g } of perVariant)
    row(label, fg, bg, kind, g, scope, `variant '${name}'`);
}

// ── the shipped presets ──────────────────────────────────────────────────────
// A preset overlays the tokens it moves, so each one is re-read on top of
// `tokens.css` and its own variants are audited against the same bars. Only the
// variants a preset actually recolors are listed; the rest are the shipped ones
// already covered above, re-tinted by the preset's neutral hue.
for (const [id, preset] of Object.entries(presets)) {
  if (preset.default) continue;
  const theme = presolve(here, `../src/themes/${id}.css`);
  const { variantScopes: scopes, resolveToken: resolve } = await readTokensCss([
    CSS,
    theme,
  ]);
  console.log(`\nPRESET '${id}'`);
  for (const name of Object.keys(preset.colors))
    for (const { label, fg, bg, kind, gate: g } of perVariant)
      row(
        `${name} · ${label}`,
        fg,
        bg,
        kind,
        g,
        scopes.get(name),
        `preset '${id}'`,
        resolve,
      );
}

// ── gamut audit of the primitive ramps ───────────────────────────────────────
// Report any stop that leaves sRGB and how far gamut mapping moves it (ΔE OK).
// Each stop is measured in both schemes, since it carries two values.
console.log('\nGAMUT (primitive ramps)');
const stops = [];
for (const [name, value] of root) {
  const m = name.match(/^--manti-(gray|orange|green|amber|red|blue)-(\d+)$/);
  if (!m) continue;
  for (const theme of ['light', 'dark']) {
    const c = color(value, theme, root);
    if (c) stops.push({ id: `${m[1]}-${m[2]} ${theme}`, c });
  }
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
