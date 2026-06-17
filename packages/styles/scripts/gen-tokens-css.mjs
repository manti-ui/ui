/**
 * Generate the primitive/scale `--manti-*` custom properties in
 * `src/tokens.css` from the typed token contract in `@manti-ui/tokens`.
 *
 * The token contract (`packages/tokens/src/index.ts`) is the single source of
 * truth for primitive ramps and plain scale values. This script mirrors those
 * values into the CSS custom-property region delimited by the
 * `@tokens:generated` markers, so the two can never drift by hand.
 *
 * The theme-aware roles (semantic surfaces/text, elevation, glass, ambient) and
 * the tonal `--tone-*` vocabulary stay hand-authored below the region — they use
 * `light-dark()`/`color-mix()` which a plain TS value cannot express.
 *
 *   node scripts/gen-tokens-css.mjs           # rewrite the region
 *   node scripts/gen-tokens-css.mjs --check    # fail if the region is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_TS = resolve(here, '../../tokens/src/index.ts');
const CSS = resolve(here, '../src/tokens.css');
const START = '/* @tokens:generated:start */';
const END = '/* @tokens:generated:end */';
const check = process.argv.includes('--check');

const t = await import(TOKENS_TS);

const lines = [];
const decl = (name, value) => lines.push(`    --${name}: ${value};`);
const head = (title) => {
  lines.push('');
  lines.push(`    /* ${title} */`);
};

lines.push(
  '    /* Primitive ramps — fixed OKLCH scales, identical in light and dark. */',
);
for (const [ramp, stops] of Object.entries(t.colorPrimitives))
  for (const [stop, value] of Object.entries(stops))
    decl(`manti-${ramp}-${stop}`, value);

head('Radius');
for (const [k, v] of Object.entries(t.radius)) decl(`manti-radius-${k}`, v);

head('Spacing');
for (const [k, v] of Object.entries(t.space)) decl(`manti-space-${k}`, v);

head('Typography');
for (const [k, v] of Object.entries(t.fontFamily)) decl(`manti-font-${k}`, v);
for (const [k, v] of Object.entries(t.fontSize)) decl(`manti-text-${k}`, v);
for (const [k, v] of Object.entries(t.lineHeight)) decl(`manti-leading-${k}`, v);
for (const [k, v] of Object.entries(t.fontWeight)) decl(`manti-weight-${k}`, v);

head('Motion');
for (const [k, v] of Object.entries(t.duration)) decl(`manti-duration-${k}`, v);
for (const [k, v] of Object.entries(t.easing)) decl(`manti-ease-${k}`, v);

head('Z-index');
for (const [k, v] of Object.entries(t.zIndex)) decl(`manti-z-${k}`, v);

const block = lines.join('\n');

const raw = await readFile(CSS, 'utf8');
const start = raw.indexOf(START);
const end = raw.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  console.error(
    'gen-tokens-css: could not find the @tokens:generated markers in tokens.css',
  );
  process.exit(1);
}

const spliced =
  raw.slice(0, start + START.length) + '\n' + block + '\n    ' + raw.slice(end);
const config = await prettier.resolveConfig(CSS);
const formatted = await prettier.format(spliced, {
  ...config,
  parser: 'css',
  filepath: CSS,
});

if (check) {
  if (formatted !== raw) {
    console.error(
      'tokens.css is out of date with the @manti-ui/tokens contract.\n' +
        'Run `pnpm gen:tokens` and commit the result.',
    );
    process.exit(1);
  }
  console.log('tokens.css is in sync with the token contract.');
} else {
  await writeFile(CSS, formatted);
  const count = lines.filter((l) => l.includes('--manti-')).length;
  console.log(`gen-tokens-css: wrote ${count} generated declarations.`);
}
