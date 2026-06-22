import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';

/**
 * Build-time search index. Walks `src/content/**\/*.mdx`, strips each page to
 * plain text, and exposes the records as the `virtual:manti-search` module so the
 * client can build a MiniSearch index without shipping the rendered MDX as data.
 */
const VIRTUAL_ID = 'virtual:manti-search';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

interface SearchDoc {
  slug: string;
  title: string;
  group: string;
  text: string;
}

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    data[key] = val;
  }
  return { data, body: raw.slice(match[0].length) };
}

function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/^\s*import\s+.*$/gm, ' ') // import lines
    .replace(/^\s*export\s+.*$/gm, ' ') // export lines
    .replace(/<[^>]+>/g, ' ') // JSX / HTML tags
    .replace(/\{[^}]*\}/g, ' ') // JSX expressions
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → link text
    .replace(/[#>*_~|`]+/g, ' ') // markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function collectDocs(contentDir: string): SearchDoc[] {
  let entries: string[];
  try {
    entries = readdirSync(contentDir, { recursive: true }) as string[];
  } catch {
    return [];
  }
  const docs: SearchDoc[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.mdx')) continue;
    const raw = readFileSync(join(contentDir, entry), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    if (!data.slug) continue;
    docs.push({
      slug: data.slug,
      title: data.title ?? data.slug,
      group: data.group ?? '',
      text: toPlainText(body).slice(0, 4000),
    });
  }
  return docs;
}

export function searchIndexPlugin(): Plugin {
  let contentDir = '';
  return {
    name: 'manti:search-index',
    configResolved(config) {
      contentDir = join(config.root, 'src', 'content');
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(collectDocs(contentDir))};`;
    },
    configureServer(server) {
      server.watcher.add(contentDir);
      const invalidate = (file: string) => {
        if (!file.endsWith('.mdx')) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', invalidate);
      server.watcher.on('change', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}
