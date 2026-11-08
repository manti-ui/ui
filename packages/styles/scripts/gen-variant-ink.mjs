/**
 * Choose each variant's `--variant-on-solid` by rule instead of by hand.
 *
 * A solid on a Radix step 9 takes the ink Radix designs for that scale (light,
 * except on Sky, Mint, Lime, Yellow and Amber). A solid that is not a step 9
 * (the neutral variants paint step 12) is measured, and the ink with the higher
 * contrast wins. The winner goes into the `@variant-ink:generated` region of
 * `src/tokens.css`.
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
 * The rule itself lives in `lib/variant-ink.mjs`, shared with the preset
 * theme generator.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve as presolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import prettier from 'prettier';

import { readTokensCss } from './lib/tokens-css.mjs';
import { AA, INKS, pickInk } from './lib/variant-ink.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CSS = presolve(here, '../src/tokens.css');
const START = '/* @variant-ink:generated:start */';
const END = '/* @variant-ink:generated:end */';
const check = process.argv.includes('--check');
const report = process.argv.includes('--report');

const THEMES = ['light', 'dark'];

const { variantScopes, resolveToken } = await readTokensCss(CSS);
const { colorScales } = await import(
  pathToFileURL(presolve(here, '../../tokens/src/index.ts')).href
);
const source = await readFile(CSS, 'utf8');

/**
 * The Radix scale a variant's solid sits on, when that solid is a step 9
 * (`--variant-solid: var(--manti-orange-9)` → `orange`), else null.
 */
function radixScaleOf(variant) {
  const blocks = source.matchAll(
    new RegExp(`\\[data-variant='${variant}'\\]\\s*\\{([^}]*)\\}`, 'g'),
  );
  for (const [, body] of blocks) {
    const m = body.match(/--variant-solid:\s*var\(--manti-([a-z]+)-9\)/);
    if (m) return colorScales[m[1]]?.radix ?? null;
  }
  return null;
}

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
    const candidates = [];
    for (const ink of INKS) {
      const c = resolveToken(ink.token, theme, scope);
      if (c.err) {
        console.error(`gen-variant-ink: ${ink.token}: ${c.err}`);
        failed = true;
        continue;
      }
      candidates.push({ ...ink, c: c.c });
    }
    if (candidates.length < INKS.length) continue;
    const { scored, chosen } = pickInk(
      solid.c,
      candidates,
      radixScaleOf(variant),
    );
    perTheme[theme] = chosen;
    rows.push({ variant, theme, scored, chosen });
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
