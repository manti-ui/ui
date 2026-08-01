import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';

/**
 * Publish/modify dates for every content page, exposed as `virtual:manti-doc-dates`.
 *
 * They come from git history, which only Node can read — so they can't be
 * derived inside the app the way titles and descriptions are (`pages.ts`).
 * This plugin is the one build-time hop that gets them into the SSR bundle,
 * where `entry-server.tsx` joins them onto the page list by slug and hands the
 * result to the JSON-LD / `article:*` / sitemap renderers in `head.ts`.
 *
 * Keyed by slug rather than file path so the only frontmatter field parsed here
 * is `slug` — every other field stays owned by `pages.ts`.
 */
const VIRTUAL_ID = 'virtual:manti-doc-dates';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export interface DocDates {
  /** ISO date (yyyy-mm-dd) of the first commit touching the source file. */
  published: string;
  /** ISO date (yyyy-mm-dd) of the last commit touching the source file. */
  modified: string;
}

/** The `slug:` line alone — everything else about a page comes from `pages.ts`. */
function parseSlug(raw: string): string | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!match) return null;
  const slug = /^slug:\s*['"]?([^'"\r\n]+)['"]?\s*$/m.exec(match[1]);
  return slug ? slug[1].trim() : null;
}

/**
 * First/last commit dates (yyyy-mm-dd) for a file, from git history. Returns
 * null when git is unavailable or the file has no commits yet (fresh file,
 * tarball deploy) — callers fall back to the filesystem mtime.
 */
function gitDates(cwd: string, file: string): DocDates | null {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--format=%cs', '--', file],
      { cwd, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' },
    ).trim();
    if (!out) return null;
    const lines = out.split('\n');
    return { modified: lines[0], published: lines[lines.length - 1] };
  } catch {
    return null;
  }
}

function collectDates(contentDir: string): Record<string, DocDates> {
  let entries: string[];
  try {
    entries = readdirSync(contentDir, { recursive: true }) as string[];
  } catch {
    return {};
  }
  const dates: Record<string, DocDates> = {};
  for (const entry of entries) {
    if (!entry.endsWith('.mdx')) continue;
    const file = join(contentDir, entry);
    const slug = parseSlug(readFileSync(file, 'utf8'));
    if (!slug) continue;
    const mtime = statSync(file).mtime.toISOString().slice(0, 10);
    dates[slug] = gitDates(contentDir, entry) ?? {
      published: mtime,
      modified: mtime,
    };
  }
  return dates;
}

export function docDatesPlugin(): Plugin {
  let contentDir = '';
  return {
    name: 'manti:doc-dates',
    configResolved(config) {
      contentDir = join(config.root, 'src', 'content');
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(collectDates(contentDir))};`;
    },
  };
}
