/**
 * Generate the component-token reference table in `docs/component-tokens.md`
 * from the `componentTokens` registry in `@manti-ui/tokens` (the list of tokens)
 * and each component's CSS (each token's base default value).
 *
 * Single source of truth — never hand-edit the region between the
 * `@component-tokens:generated` markers. The styles build runs this with
 * `--check` so the doc can never drift from the tokens.
 *
 *   node scripts/gen-component-tokens-doc.mjs           # rewrite the table
 *   node scripts/gen-component-tokens-doc.mjs --check    # fail if the table is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_TS = resolve(here, '../../tokens/src/index.ts');
const COMPONENTS = resolve(here, '../src/components');
const DOC = resolve(here, '../../../docs/component-tokens.md');
const START = '<!-- @component-tokens:generated:start -->';
const END = '<!-- @component-tokens:generated:end -->';
const check = process.argv.includes('--check');

const { componentTokens } = await import(TOKENS_TS);

/** The base (first-declared) default value of each `--manti-{comp}-*` token. */
async function defaults(comp) {
  const css = await readFile(resolve(COMPONENTS, `${comp}.css`), 'utf8');
  const found = {};
  const re = new RegExp(`--manti-${comp}-([a-z0-9-]+)\\s*:\\s*([^;]+);`, 'g');
  for (const m of css.matchAll(re))
    if (!(m[1] in found)) found[m[1]] = m[2].trim().replace(/\s+/g, ' ');
  return found;
}

const rows = [];
for (const comp of Object.keys(componentTokens).sort()) {
  const def = await defaults(comp);
  for (const prop of componentTokens[comp])
    rows.push(
      `| \`${comp}\` | \`--manti-${comp}-${prop}\` | \`${def[prop] ?? '—'}\` |`,
    );
}

const table = [
  '| Component | Token | Default |',
  '| --- | --- | --- |',
  ...rows,
].join('\n');

const raw = await readFile(DOC, 'utf8');
const start = raw.indexOf(START);
const end = raw.indexOf(END);
if (start === -1 || end === -1 || end < start) {
  console.error(
    'gen-component-tokens-doc: could not find the @component-tokens:generated markers',
  );
  process.exit(1);
}

const spliced =
  raw.slice(0, start + START.length) + '\n' + table + '\n' + raw.slice(end);
const config = await prettier.resolveConfig(DOC);
const formatted = await prettier.format(spliced, {
  ...config,
  parser: 'markdown',
  filepath: DOC,
});

if (check) {
  if (formatted !== raw) {
    console.error(
      'docs/component-tokens.md is out of date with the componentTokens registry.\n' +
        'Run `pnpm --filter @manti-ui/styles gen:component-tokens-doc` and commit the result.',
    );
    process.exit(1);
  }
  console.log('component-tokens.md is in sync with the token registry.');
} else {
  await writeFile(DOC, formatted);
  console.log(`gen-component-tokens-doc: wrote ${rows.length} token rows.`);
}
