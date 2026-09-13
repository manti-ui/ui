import type { ComponentType } from 'react';

import type { DocFrontmatter, FaqEntry, HowTo, TocEntry } from './types';

interface MdxModule {
  default: ComponentType;
  frontmatter: DocFrontmatter;
  tableOfContents?: TocEntry[];
}

// Every `.mdx` under content/ becomes a route. Eager so routing, the sidebar and
// the search index can all read frontmatter synchronously at module load.
const modules = import.meta.glob<MdxModule>('./content/**/*.mdx', {
  eager: true,
});
const sources = import.meta.glob<string | { default: string }>(
  './content/**/*.mdx',
  { eager: true, query: '?raw', import: 'default' },
);

/**
 * The raw MDX for one file.
 *
 * The client build hands back the string directly; the SSR build used by the
 * prerenderer hands back the module namespace instead, so both shapes are
 * normalized here rather than at each call site.
 */
function rawSource(path: string): string {
  const source = sources[path];
  if (typeof source === 'string') return source;
  return source?.default ?? '';
}

export interface DocPage {
  slug: string;
  title: string;
  group: string;
  order: number;
  description?: string;
  date?: string;
  /** Small sidebar tag, e.g. `New`. */
  badge?: string;
  /** Q&A pairs rendered by `<Faq />` and emitted as `FAQPage` JSON-LD. */
  faq?: FaqEntry[];
  /** Step-by-step instructions emitted as `HowTo` JSON-LD. */
  howto?: HowTo;
  /** Raw MDX copied by the page assistant action. */
  source: string;
  Component: ComponentType;
  toc: TocEntry[];
}

export const pages: DocPage[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: mod.frontmatter.slug,
    title: mod.frontmatter.title,
    group: mod.frontmatter.group ?? '',
    order: mod.frontmatter.order ?? 0,
    description: mod.frontmatter.description,
    date: mod.frontmatter.date,
    badge: mod.frontmatter.badge,
    faq: mod.frontmatter.faq,
    howto: mod.frontmatter.howto,
    source: rawSource(path),
    Component: mod.default,
    toc: mod.tableOfContents ?? [],
  }))
  .sort((a, b) => a.order - b.order);

export const pageBySlug = new Map<string, DocPage>(
  pages.map((page) => [page.slug, page]),
);

/** Normalize a router pathname to a registered slug (strips trailing slash). */
export function slugFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return '/';
  return pathname.replace(/\/+$/, '');
}
