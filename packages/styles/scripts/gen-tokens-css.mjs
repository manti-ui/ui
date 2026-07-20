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
 * the `--variant-*` vocabulary stay hand-authored below the region — they use
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

/**
 * A linear scale anchored on one base custom property: the base stop is emitted
 * literally, every other stop as `calc(var(--<baseVar>) * <ratio>)` where the
 * ratio is derived here from the contract's own resolved values (so the two can
 * never drift). Overriding the single base var live-rescales the whole family.
 */
const numeric = (v) => parseFloat(v);
const ratio = (value, base) => {
  const r = numeric(value) / numeric(base);
  return Number.isInteger(r) ? String(r) : String(Number(r.toFixed(4)));
};

/**
 * The neutral ramp is the panel-signature cool hue: its per-stop lightness and
 * chroma stay authored in the contract, but the hue is centralized on the
 * hand-authored `--manti-cool-hue` token so the whole neutral (ramp + chrome)
 * can be re-tinted from one place.
 */
const coolHued = (value) => {
  const m = value.match(/^oklch\(([^)]+)\)$/);
  if (!m) return value;
  const [l, c] = m[1].trim().split(/\s+/);
  return `oklch(${l} ${c} var(--manti-cool-hue))`;
};

lines.push(
  '    /* Primitive ramps — fixed OKLCH scales, identical in light and dark. */',
);
for (const [ramp, stops] of Object.entries(t.colorPrimitives))
  for (const [stop, value] of Object.entries(stops))
    decl(`manti-${ramp}-${stop}`, ramp === 'gray' ? coolHued(value) : value);

head('Radius');
for (const [k, v] of Object.entries(t.radius)) decl(`manti-radius-${k}`, v);

head('Control height');
for (const [k, v] of Object.entries(t.controlHeight))
  decl(`manti-control-height-${k}`, v);

head('Spacing');
/* Anchored on `--manti-space-1` (the 0.25rem grid unit, also Tailwind's
   `--spacing` base): override it once to rescale the whole spacing scale. */
const spaceUnit = t.space[1];
for (const [k, v] of Object.entries(t.space)) {
  if (numeric(v) === 0 || k === '1') decl(`manti-space-${k}`, v);
  else decl(`manti-space-${k}`, `calc(var(--manti-space-1) * ${ratio(v, spaceUnit)})`);
}

head('Typography');
for (const [k, v] of Object.entries(t.fontFamily)) decl(`manti-font-${k}`, v);
/* Anchored on `--manti-text-base` (the body size): override it once and the
   whole type scale rescales proportionally. */
const textBase = t.fontSize.base;
for (const [k, v] of Object.entries(t.fontSize)) {
  if (k === 'base') decl(`manti-text-${k}`, v);
  else decl(`manti-text-${k}`, `calc(var(--manti-text-base) * ${ratio(v, textBase)})`);
}
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
