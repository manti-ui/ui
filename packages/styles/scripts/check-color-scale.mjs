/**
 * Enforce the color-scale boundary between palette primitives and components.
 *
 * Primitive stops are the palette author's vocabulary. Component CSS consumes
 * semantic roles or the uniform --variant-* vocabulary so theme mapping and
 * contrast decisions stay centralized in tokens.css.
 *
 * The shipped presets are checked on the other half of the contract: their
 * ladders are generated from one base color, so what matters is that each rung
 * still moves in the direction that gains contrast for its theme.
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { readTokensCss } from './lib/tokens-css.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const components = resolve(here, '../src/components');
const tokensPath = resolve(here, '../src/tokens.css');
const tokensTs = resolve(here, '../../tokens/src/index.ts');
const primitive = /--manti-(gray|orange|green|amber|red|blue)-(\d+)/g;
const rawColor = /(?:oklch|rgb|rgba|hsl|hsla)\(|#[0-9a-fA-F]{3,8}\b/;
const files = (await readdir(components)).filter((file) =>
  file.endsWith('.css'),
);
const violations = [];

for (const file of files) {
  const path = resolve(components, file);
  const source = await readFile(path, 'utf8');
  // Ignore comments: examples and explanations do not affect component output.
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [index, lineText] of css.split('\n').entries()) {
    if (rawColor.test(lineText)) {
      violations.push(
        `${file}:${index + 1}: raw color value — use a semantic role or --variant-* instead`,
      );
    }
  }
  for (const match of css.matchAll(primitive)) {
    const line = css.slice(0, match.index).split('\n').length;
    violations.push(
      `${file}:${line}: direct primitive ${match[0]} — use a semantic role or --variant-* instead`,
    );
  }
}

const tokens = await readFile(tokensPath, 'utf8');
const builtInRoles = {
  '--variant-soft-bg': [1, 4],
  '--variant-soft-bg-hover': [1, 4],
  '--variant-border': [6, 8],
  '--variant-ring': [7, 8],
  // Built-in solids may use 7/8 as a documented contrast exception; 9/10 are
  // the normal solid pair from the scale contract.
  '--variant-solid': [7, 10],
};
const variantBlock = /\[data-variant='([\w-]+)'\]\s*\{([\s\S]*?)\n{2}\}/g;
for (const match of tokens.matchAll(variantBlock)) {
  const [, variant, body] = match;
  if (
    !['primary', 'secondary', 'tertiary', 'danger', 'outline'].includes(variant)
  )
    continue;
  for (const [property, [min, max]] of Object.entries(builtInRoles)) {
    const declaration = body.match(
      new RegExp(`${property.replaceAll('-', '\\-')}\\s*:\\s*([\\s\\S]*?);`),
    );
    if (!declaration) continue;
    for (const primitiveMatch of declaration[1].matchAll(primitive)) {
      const step = Number(primitiveMatch[2]);
      // Gray is a theme anchor in dark-mode color-mix expressions, not the
      // variant hue being assigned to the role.
      if (primitiveMatch[1] === 'gray') continue;
      const before = declaration[1].slice(0, primitiveMatch.index);
      const insideColorMix =
        before.lastIndexOf('color-mix(') > before.lastIndexOf(')');
      // A dark-mode soft surface intentionally mixes the accent with the dark
      // neutral backdrop. The accent stop inside that derivation is not the
      // semantic surface step itself.
      if (insideColorMix && property.includes('soft-bg')) continue;
      if (step < min || step > max) {
        violations.push(
          `tokens.css: variant ${variant} ${property} uses ${primitiveMatch[0]} (expected step ${min}–${max})`,
        );
      }
    }
  }
}

// ── preset interaction progression ───────────────────────────────────────────
// Rest → hover → active must keep moving one way, and the way the shipped
// variants move: a soft surface deepens into the page (darker on light, lighter
// on dark), a solid fill lifts off it (lighter on light, darker on dark). A
// preset that inverts a rung would read as a control lighting up on press in one
// theme and dimming in the other.
const { presets } = await import(pathToFileURL(tokensTs).href);
const ladders = [
  {
    name: 'soft',
    lightens: false,
    rungs: [
      '--variant-soft-bg',
      '--variant-soft-bg-hover',
      '--variant-soft-bg-active',
    ],
  },
  {
    name: 'solid',
    lightens: true,
    rungs: [
      '--variant-solid',
      '--variant-solid-hover',
      '--variant-solid-active',
    ],
  },
];

for (const [id, preset] of Object.entries(presets)) {
  if (preset.default) continue;
  const themePath = resolve(here, `../src/themes/${id}.css`);
  const { variantScopes, resolveToken } = await readTokensCss([
    tokensPath,
    themePath,
  ]);
  for (const variant of Object.keys(preset.colors)) {
    const scope = variantScopes.get(variant);
    for (const { name, lightens, rungs } of ladders) {
      for (const theme of ['light', 'dark']) {
        const up = lightens === (theme === 'light');
        const steps = rungs.map((token) => {
          const { c, err } = resolveToken(token, theme, scope);
          if (err) violations.push(`themes/${id}.css: ${err}`);
          return c && c.to('oklch').coords[0];
        });
        if (steps.some((l) => l == null)) continue;
        const ordered = steps.every(
          (l, i) => i === 0 || (up ? l > steps[i - 1] : l < steps[i - 1]),
        );
        if (!ordered)
          violations.push(
            `themes/${id}.css: ${variant} ${name} ladder should get ` +
              `${up ? 'lighter' : 'darker'} in ${theme} ` +
              `(L ${steps.map((l) => l.toFixed(3)).join(' → ')})`,
          );
      }
    }
  }
}

if (violations.length) {
  console.error('\nColor-scale contract violations:\n');
  for (const violation of violations) console.error(`  ${violation}`);
  console.error(
    '\nPrimitive ramps are allowed in tokens.css and palette documentation only.\n',
  );
  process.exit(1);
}

console.log(`✓ color-scale contract (${files.length} component stylesheets)`);
