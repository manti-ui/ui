import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';

/**
 * The raw text of every content page (`virtual:manti-doc-sources`, keyed by
 * slug) and of every demo file (`virtual:manti-demo-sources`, keyed by name).
 *
 * `pages.ts` already globs the same files with `?raw` for the copy-page button,
 * but that query is only honored in the client environment: the SSR build the
 * prerenderer imports hands back the compiled MDX component instead of its
 * text. Both `llms-full.txt` and the page-copy Markdown need the real text, so
 * it comes from disk here, the same way `vite-plugin-doc-dates` reads git.
 *
 * Page frontmatter is stripped: `slug` and `order` are routing data, and the
 * useful fields are restated by whatever renders the page's header.
 */
const DOCS_ID = 'virtual:manti-doc-sources';
const DEMOS_ID = 'virtual:manti-demo-sources';
const RESOLVED: Record<string, string | undefined> = {
  [DOCS_ID]: '\0' + DOCS_ID,
  [DEMOS_ID]: '\0' + DEMOS_ID,
};

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

/** Every demo file's text, keyed by its name without extension. */
function collectDemos(demoDir: string): Record<string, string> {
  let entries: string[];
  try {
    entries = readdirSync(demoDir, { recursive: true }) as string[];
  } catch {
    return {};
  }
  const demos: Record<string, string> = {};
  for (const entry of entries) {
    if (!entry.endsWith('.tsx')) continue;
    const name = entry.replace(/\\/g, '/').replace(/\.tsx$/, '');
    demos[name] = readFileSync(join(demoDir, entry), 'utf8');
  }
  return demos;
}

export function docSourcesPlugin(): Plugin {
  let contentDir = '';
  let demoDir = '';
  return {
    name: 'manti:doc-sources',
    configResolved(config) {
      contentDir = join(config.root, 'src', 'content');
      demoDir = join(config.root, 'src', 'demos');
    },
    resolveId(id) {
      return RESOLVED[id] ?? null;
    },
    load(id) {
      if (id === RESOLVED[DOCS_ID]) {
        return `export default ${JSON.stringify(collectSources(contentDir))};`;
      }
      if (id === RESOLVED[DEMOS_ID]) {
        return `export default ${JSON.stringify(collectDemos(demoDir))};`;
      }
      return null;
    },
  };
}
