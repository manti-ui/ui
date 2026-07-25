/**
 * Choose each variant's `--variant-on-solid` by measurement instead of by hand.
 *
 * The label sitting on a solid fill has exactly one job: be readable. Which ink
 * wins is a fact about the solid's luminance, not a taste call — so this script
 * resolves every variant's `--variant-solid` per theme, measures the candidate
 * inks against it, and writes the winner into the `@variant-ink:generated`
 * region of `src/tokens.css`.
 *
 *   node scripts/gen-variant-ink.mjs           # rewrite the region
 *   node scripts/gen-variant-ink.mjs --check    # fail if the region is stale
 *   node scripts/gen-variant-ink.mjs --report   # show the margins, write nothing
 *
 * This closes a real failure mode. `--variant-on-solid` used to be a constant
 * picked once against a solid that has since moved twice (a ramp rename, then a
 * resample); nothing tied the two together, so the ink could quietly stop being
 * the right choice and only a human reading the contrast report would notice.
 *
 * Ranking is lexicographic: clear WCAG 2.1 AA (4.5:1) first, then maximise APCA
 * Lc among whatever survives. The order matters because the two metrics
 * genuinely disagree here. On the primary orange, light ink scores Lc 65 against
 * dark ink's 41 — APCA much prefers it — yet it lands at 3.39:1 where dark ink
 * reaches 5.24:1. AA is the floor the contrast gate enforces and the one a
 * consumer is held to, so AA wins and APCA only breaks ties above it. If no
 * candidate clears the bar the script says so and exits non-zero rather than
 * quietly shipping the least-bad ink.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

import { apca, readTokensCss, wcag } from './lib/tokens-css.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CSS = presolve(here, '../src/tokens.css');
const START = '/* @variant-ink:generated:start */';
const END = '/* @variant-ink:generated:end */';
const check = process.argv.includes('--check');
const report = process.argv.includes('--report');

/**
 * The inks a solid may carry. Both are existing tokens, so the generated region
 * never introduces a bespoke literal: `--manti-text-on-accent` is the near-white
 * used across accent surfaces, `--manti-gray-12` the darkest neutral.
 */
const INKS = [
  { token: '--manti-text-on-accent', label: 'light' },
  { token: '--manti-gray-12', label: 'dark' },
];

const THEMES = ['light', 'dark'];
/** WCAG 2.1 AA for normal text — the same bar `check-contrast.mjs` gates on. */
const AA = 4.5;

const { variantScopes, resolveToken } = await readTokensCss(CSS);

const rows = [];
const picks = new Map();
let failed = false;

for (const [variant, scope] of variantScopes) {
  const perTheme = {};
  for (const theme of THEMES) {
    const solid = resolveToken('--variant-solid', theme, scope);
    if (solid.err) {
      console.error(`gen-variant-ink: ${variant} (${theme}): ${solid.err}`);
      failed = true;
      continue;
    }
    const scored = [];
    for (const ink of INKS) {
      const c = resolveToken(ink.token, theme, scope);
      if (c.err) {
        console.error(`gen-variant-ink: ${ink.token}: ${c.err}`);
        failed = true;
        continue;
      }
      scored.push({
        ...ink,
        lc: apca(c.c, solid.c),
        ratio: wcag(c.c, solid.c),
      });
    }
    if (scored.length < INKS.length) continue;
    // AA first, Lc second — see the header note on why the order is not free.
    const passing = scored.filter((s) => s.ratio >= AA);
    if (!passing.length) {
      const best = scored.reduce((a, b) => (b.ratio > a.ratio ? b : a));
      console.error(
        `gen-variant-ink: ${variant} (${theme}): no ink clears AA on this solid ` +
          `— best is ${best.label} at ${best.ratio.toFixed(2)}:1. Move the solid.`,
      );
      failed = true;
      continue;
    }
    passing.sort((a, b) => b.lc - a.lc);
    perTheme[theme] = passing[0];
    rows.push({ variant, theme, scored, chosen: passing[0] });
  }
  if (Object.keys(perTheme).length === THEMES.length)
    picks.set(variant, perTheme);
}

if (failed) process.exit(1);

if (report) {
  console.log('\nVARIANT INK — candidates measured against --variant-solid\n');
  for (const { variant, theme, scored, chosen } of rows) {
    const all = scored
      .map(
        (s) =>
          `${s.label} Lc${s.lc.toFixed(0)}/${s.ratio.toFixed(2)}` +
          (s.ratio >= AA ? '' : ' ✗AA'),
      )
      .join('   ');
    console.log(
      `  ${`${variant} (${theme})`.padEnd(22)} → ${chosen.label.padEnd(6)}` +
        `    ${all}`,
    );
  }
  console.log();
  process.exit(0);
}

// ── emit ─────────────────────────────────────────────────────────────────────
const lines = [];
for (const [variant, perTheme] of picks) {
  const l = perTheme.light,
    d = perTheme.dark;
  const value =
    l.token === d.token
      ? `var(${l.token})`
      : `light-dark(var(${l.token}), var(${d.token}))`;
  const note =
    l.token === d.token
      ? `${l.label} ink, Lc ${Math.min(l.lc, d.lc).toFixed(0)}+ in both themes`
      : `${l.label} on light, ${d.label} on dark`;
  lines.push(`  [data-variant='${variant}'] {`);
  lines.push(`    /* ${note} */`);
  lines.push(`    --variant-on-solid: ${value};`);
  lines.push(`  }`);
}

const raw = await readFile(CSS, 'utf8');
const start = raw.indexOf(START);
const end = raw.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  console.error(
    'gen-variant-ink: could not find the @variant-ink:generated markers in tokens.css',
  );
  process.exit(1);
}

const spliced =
  raw.slice(0, start + START.length) +
  '\n' +
  lines.join('\n') +
  '\n  ' +
  raw.slice(end);
const config = await prettier.resolveConfig(CSS);
const formatted = await prettier.format(spliced, {
  ...config,
  parser: 'css',
  filepath: CSS,
});

if (check) {
  if (formatted !== raw) {
    console.error(
      'tokens.css variant inks are stale.\n' +
        'Run `pnpm gen:variant-ink` and commit the result.',
    );
    process.exit(1);
  }
  console.log('variant inks are in sync with the measured solids.');
} else {
  await writeFile(CSS, formatted);
  console.log(`gen-variant-ink: wrote ${picks.size} variant inks.`);
}
