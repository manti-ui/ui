/**
 * Verify that the Tier-3 `--manti-{component}-*` component tokens defined in each
 * component's CSS exactly match the `componentTokens` registry in
 * `@manti-ui/tokens`.
 *
 * The registry is the public, semver-stable source of truth for the
 * per-component override surface (docs, autocomplete, semver). This guard fails
 * the build on drift in either direction:
 *   - a token added to a component's CSS but not registered, or
 *   - a registered token whose CSS definition was removed/renamed.
 *
 * Convention: a component token's prefix equals the component's file basename
 * (which equals its `data-scope`), so `button.css` owns `--manti-button-*`. A
 * *definition* is `--manti-{comp}-{prop}:` (property position); `var(...)` usages
 * are ignored because the token there is followed by `)`, not `:`.
 *
 *   node scripts/check-component-tokens.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_TS = resolve(here, '../../tokens/src/index.ts');
const COMPONENTS = resolve(here, '../src/components');

const { componentTokens } = await import(TOKENS_TS);

const sorted = (xs) => [...xs].sort();
const eq = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const names = (comp, props) => props.map((p) => `--manti-${comp}-${p}`).join(', ');

// Collect, per component file, the set of `--manti-{basename}-*` tokens it defines.
const defined = {};
for (const file of (await readdir(COMPONENTS)).filter((f) => f.endsWith('.css'))) {
  const comp = basename(file, '.css');
  const css = await readFile(resolve(COMPONENTS, file), 'utf8');
  const props = new Set();
  for (const m of css.matchAll(new RegExp(`--manti-${comp}-([a-z0-9-]+)\\s*:`, 'g')))
    props.add(m[1]);
  if (props.size) defined[comp] = props;
}

const errors = [];

// 1. Every registered component matches its CSS exactly.
for (const [comp, registered] of Object.entries(componentTokens)) {
  const want = sorted(registered);
  if (!defined[comp]) {
    errors.push(
      `• "${comp}" is registered in componentTokens but no --manti-${comp}-* tokens are defined in ${comp}.css`,
    );
    continue;
  }
  const got = sorted(defined[comp]);
  if (!eq(want, got)) {
    const extra = got.filter((p) => !want.includes(p));
    const missing = want.filter((p) => !got.includes(p));
    const parts = [];
    if (extra.length) parts.push(`defined in CSS but not registered: ${names(comp, extra)}`);
    if (missing.length) parts.push(`registered but not defined in CSS: ${names(comp, missing)}`);
    errors.push(`• "${comp}" mismatch — ${parts.join('; ')}`);
  }
}

// 2. No component may define component tokens without being registered.
for (const [comp, props] of Object.entries(defined)) {
  if (!componentTokens[comp])
    errors.push(
      `• "${comp}.css" defines ${names(comp, [...props])} but "${comp}" is not in the componentTokens registry`,
    );
}

if (errors.length) {
  console.error(
    'Component tokens are out of sync with the componentTokens registry in @manti-ui/tokens:\n' +
      errors.join('\n') +
      '\n\nUpdate the registry in packages/tokens/src/index.ts (or the component CSS) so they match.',
  );
  process.exit(1);
}

const total = Object.values(componentTokens).reduce((n, p) => n + p.length, 0);
console.log(
  `component tokens in sync: ${Object.keys(componentTokens).length} components, ${total} tokens.`,
);
