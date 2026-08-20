/**
 * Generate the primitive/scale `--manti-*` custom properties and scoped radius
 * presets in `src/tokens.css` from the typed token contract in
 * `@manti-ui/tokens`.
 *
 * The token contract (`packages/tokens/src/index.ts`) is the single source of
 * truth for primitive ramps and plain scale values. This script mirrors those
 * values into the CSS custom-property regions delimited by the
 * `@tokens:generated` and `@radius-modes:generated` markers, so they can never
 * drift by hand.
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
import { fileURLToPath, pathToFileURL } from 'node:url';

import prettier from 'prettier';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_TS = resolve(here, '../../tokens/src/index.ts');
const CSS = resolve(here, '../src/tokens.css');
const START = '/* @tokens:generated:start */';
const END = '/* @tokens:generated:end */';
const RADIUS_MODES_START = '/* @radius-modes:generated:start */';
const RADIUS_MODES_END = '/* @radius-modes:generated:end */';
const check = process.argv.includes('--check');

const t = await import(pathToFileURL(TOKENS_TS).href);

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
/* Anchored on `--manti-radius-factor`: every step is a multiple of it, so the
   single factor makes the whole system sharper or rounder. `full` is exempt —
   it is the always-pill primitive, not a size, and scaling it would only turn
   9999px into a differently enormous 9999px. Roundness a theme can switch on
   lives in the `--manti-radius-pill`/`-thumb` channels, hand-authored in
   tokens.css alongside the `[data-radius]` presets. */
decl('manti-radius-factor', t.radiusFactor);
for (const [k, v] of Object.entries(t.radius)) {
  if (k === 'full') decl(`manti-radius-${k}`, v);
  else decl(`manti-radius-${k}`, `calc(${v} * var(--manti-radius-factor))`);
}

head('Control height');
for (const [k, v] of Object.entries(t.controlHeight))
  decl(`manti-control-height-${k}`, v);

head('Spacing');
/* Anchored on `--manti-space-1` (the 0.25rem grid unit, also Tailwind's
   `--spacing` base): override it once to rescale the whole spacing scale. */
const spaceUnit = t.space[1];
for (const [k, v] of Object.entries(t.space)) {
  if (numeric(v) === 0 || k === '1') decl(`manti-space-${k}`, v);
  else
    decl(
      `manti-space-${k}`,
      `calc(var(--manti-space-1) * ${ratio(v, spaceUnit)})`,
    );
}

head('Typography');
for (const [k, v] of Object.entries(t.fontFamily)) decl(`manti-font-${k}`, v);
/* Anchored on `--manti-text-base` (the body size): override it once and the
   whole type scale rescales proportionally. */
const textBase = t.fontSize.base;
for (const [k, v] of Object.entries(t.fontSize)) {
  if (k === 'base') decl(`manti-text-${k}`, v);
  else
    decl(
      `manti-text-${k}`,
      `calc(var(--manti-text-base) * ${ratio(v, textBase)})`,
    );
}
for (const [k, v] of Object.entries(t.lineHeight))
  decl(`manti-leading-${k}`, v);
for (const [k, v] of Object.entries(t.fontWeight)) decl(`manti-weight-${k}`, v);
/* Optical tracking. `em` units, so each stop scales with its font size. */
for (const [k, v] of Object.entries(t.letterSpacing))
  decl(`manti-tracking-${k}`, v);

head('Motion');
for (const [k, v] of Object.entries(t.duration)) decl(`manti-duration-${k}`, v);
for (const [k, v] of Object.entries(t.easing)) decl(`manti-ease-${k}`, v);

head('Z-index');
for (const [k, v] of Object.entries(t.zIndex)) decl(`manti-z-${k}`, v);

const block = lines.join('\n');

/* Radius scale variables are normally computed on `:root`. A custom property
   inherited from there carries its already-computed value, so changing only
   `--manti-radius-factor` on a subtree cannot rescale those inherited steps.
   Re-declare the scale in every shipped `[data-radius]` scope so each step is
   computed against that mode's local factor. This keeps the documented subtree
   preset API real while deriving every resolved size from the token contract. */
const radiusModeLines = [];
for (const [mode, settings] of Object.entries(t.radiusModes)) {
  radiusModeLines.push(`  [data-radius='${mode}'] {`);
  radiusModeLines.push(`    --manti-radius-factor: ${settings.factor};`);
  for (const [step, value] of Object.entries(t.radius)) {
    if (step === 'full') continue;
    radiusModeLines.push(
      `    --manti-radius-${step}: calc(${value} * var(--manti-radius-factor));`,
    );
  }
  radiusModeLines.push(`    --manti-radius-full: ${settings.full};`);
  radiusModeLines.push(`    --manti-radius-pill: ${settings.pill};`);
  radiusModeLines.push(`    --manti-radius-thumb: ${settings.thumb};`);
  radiusModeLines.push('  }', '');
}
const radiusModesBlock = radiusModeLines.join('\n').trimEnd();

const raw = await readFile(CSS, 'utf8');
const start = raw.indexOf(START);
const end = raw.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  console.error(
    'gen-tokens-css: could not find the @tokens:generated markers in tokens.css',
  );
  process.exit(1);
}

const withTokens =
  raw.slice(0, start + START.length) + '\n' + block + '\n    ' + raw.slice(end);
const radiusStart = withTokens.indexOf(RADIUS_MODES_START);
const radiusEnd = withTokens.indexOf(RADIUS_MODES_END);
if (radiusStart === -1 || radiusEnd === -1 || radiusEnd < radiusStart) {
  console.error(
    'gen-tokens-css: could not find the @radius-modes:generated markers in tokens.css',
  );
  process.exit(1);
}
const spliced =
  withTokens.slice(0, radiusStart + RADIUS_MODES_START.length) +
  '\n' +
  radiusModesBlock +
  '\n  ' +
  withTokens.slice(radiusEnd);
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
  const count =
    lines.filter((l) => l.includes('--manti-')).length +
    radiusModeLines.filter((l) => l.includes('--manti-')).length;
  console.log(`gen-tokens-css: wrote ${count} generated declarations.`);
}
