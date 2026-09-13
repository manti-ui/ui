import type { ComponentType } from 'react';

import docSources from 'virtual:manti-doc-sources';

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
  /** The page's Markdown body, frontmatter stripped (`virtual:manti-doc-sources`). */
  source: string;
  Component: ComponentType;
  toc: TocEntry[];
}

export const pages: DocPage[] = Object.values(modules)
  .map((mod) => ({
    slug: mod.frontmatter.slug,
    title: mod.frontmatter.title,
    group: mod.frontmatter.group ?? '',
    order: mod.frontmatter.order ?? 0,
    description: mod.frontmatter.description,
    date: mod.frontmatter.date,
    badge: mod.frontmatter.badge,
    faq: mod.frontmatter.faq,
    howto: mod.frontmatter.howto,
    source: docSources[mod.frontmatter.slug] ?? '',
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
