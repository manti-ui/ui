import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';

/**
 * The raw Markdown of every content page, keyed by slug, as
 * `virtual:manti-doc-sources`.
 *
 * `pages.ts` already globs the same files with `?raw` for the copy-page button,
 * but that query is only honored in the client environment: the SSR build the
 * prerenderer imports hands back the compiled MDX component instead of its
 * text. The prerenderer needs the actual Markdown to write `llms-full.txt`, so
 * it comes from disk here, the same way `vite-plugin-doc-dates` reads git.
 *
 * Frontmatter is stripped: `slug` and `order` are routing data, and the useful
 * fields are restated in the section header the prerenderer writes.
 */
const VIRTUAL_ID = 'virtual:manti-doc-sources';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function collectSources(contentDir: string): Record<string, string> {
  let entries: string[];
  try {
    entries = readdirSync(contentDir, { recursive: true }) as string[];
  } catch {
    return {};
  }
  const sources: Record<string, string> = {};
  for (const entry of entries) {
    if (!entry.endsWith('.mdx')) continue;
    const raw = readFileSync(join(contentDir, entry), 'utf8');
    const match = FRONTMATTER.exec(raw);
    if (!match) continue;
    const slug = /^slug:\s*['"]?([^'"\r\n]+)['"]?\s*$/m.exec(match[1]);
    if (!slug) continue;
    sources[slug[1].trim()] = raw.slice(match[0].length).trim();
  }
  return sources;
}

export function docSourcesPlugin(): Plugin {
  let contentDir = '';
  return {
    name: 'manti:doc-sources',
    configResolved(config) {
      contentDir = join(config.root, 'src', 'content');
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(collectSources(contentDir))};`;
    },
  };
}
