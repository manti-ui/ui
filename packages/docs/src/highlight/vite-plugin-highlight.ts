import { readFile } from 'node:fs/promises';
import { dirname, resolve as resolvePath } from 'node:path';

import { codeToHtml } from 'shiki';
import type { Plugin } from 'vite';

/**
 * Build-time syntax highlighting for demo sources. Importing a file with the
 * `?highlight` query returns the Shiki HTML string (dual light/dark themes,
 * switched via `[data-theme]` like the MDX code blocks). Shiki runs in the
 * build/dev server only — it never reaches the client bundle.
 */
const SUFFIX = '?highlight';

export function highlightPlugin(): Plugin {
  return {
    name: 'manti:highlight',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!id.endsWith(SUFFIX)) return null;
      const base = id.slice(0, -SUFFIX.length);
      // import.meta.glob emits relative specifiers; resolve them against the
      // importing module so `load` can read an absolute file path.
      if (base.startsWith('.') && importer) {
        const importerDir = dirname(importer.split('?')[0]);
        return resolvePath(importerDir, base) + SUFFIX;
      }
      return id;
    },
    async load(id) {
      if (!id.endsWith(SUFFIX)) return null;
      const file = id.slice(0, -SUFFIX.length);
      const code = (await readFile(file, 'utf8')).trim();
      const html = await codeToHtml(code, {
        lang: 'tsx',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      });
      return `export default ${JSON.stringify(html)};`;
    },
  };
}
