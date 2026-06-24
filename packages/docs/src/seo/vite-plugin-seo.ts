import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { Plugin } from 'vite';

import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  canonicalUrl,
  pageDescription,
  pageTitle,
  type PageMeta,
} from './meta';

/**
 * Static SEO for the docs SPA.
 *
 * The app renders client-side, so every route would otherwise ship the *same*
 * index.html — one title, one description, no canonical. At build time this
 * plugin reads each content page's frontmatter and:
 *
 *   1. writes a per-route `dist/<slug>/index.html` whose <head> carries that
 *      page's title, description, canonical, Open Graph / Twitter tags and
 *      JSON-LD — so crawlers and social unfurlers that read raw HTML (Bing,
 *      Slack, X, AI bots) get correct metadata without executing JS;
 *   2. emits `dist/sitemap.xml` listing every canonical URL.
 *
 * The managed head block in index.html is delimited by `<!-- seo:start -->` /
 * `<!-- seo:end -->`; the plugin swaps its contents per page. Netlify serves the
 * nested static files before the SPA fallback, so `/components/button` gets its
 * own HTML while client-side routing still works.
 */

const SEO_START = '<!-- seo:start -->';
const SEO_END = '<!-- seo:end -->';

interface BuildPage extends PageMeta {
  /** ISO date (yyyy-mm-dd) from the source file mtime, for <lastmod>. */
  lastmod: string;
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return {};
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
  return data;
}

function collectPages(contentDir: string): BuildPage[] {
  let entries: string[];
  try {
    entries = readdirSync(contentDir, { recursive: true }) as string[];
  } catch {
    return [];
  }
  const pages: BuildPage[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.mdx')) continue;
    const file = join(contentDir, entry);
    const data = parseFrontmatter(readFileSync(file, 'utf8'));
    if (!data.slug) continue;
    pages.push({
      slug: data.slug,
      title: data.title ?? data.slug,
      description: data.description,
      lastmod: statSync(file).mtime.toISOString().slice(0, 10),
    });
  }
  return pages;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** JSON-LD, with `<` escaped so it can never break out of the <script> tag. */
function jsonLd(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

function structuredData(page: PageMeta): string {
  const website = {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  };
  if (page.slug === '/') {
    return jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        website,
        {
          '@type': 'SoftwareApplication',
          name: SITE_NAME,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          description: DEFAULT_DESCRIPTION,
          url: SITE_URL,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
    });
  }
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      website,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: canonicalUrl(page.slug),
          },
        ],
      },
    ],
  });
}

/** The full inner HTML for the managed <head> block, for one page. */
function renderHead(page: PageMeta): string {
  const title = escapeHtml(pageTitle(page));
  const description = escapeHtml(pageDescription(page));
  const url = canonicalUrl(page.slug);
  const ogType = page.slug === '/' ? 'website' : 'article';
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    structuredData(page),
  ].join('\n    ');
}

function injectHead(template: string, page: PageMeta): string {
  const start = template.indexOf(SEO_START);
  const end = template.indexOf(SEO_END);
  if (start === -1 || end === -1) {
    throw new Error(
      `[manti:seo] index.html is missing the ${SEO_START} … ${SEO_END} markers`,
    );
  }
  return (
    template.slice(0, start + SEO_START.length) +
    '\n    ' +
    renderHead(page) +
    '\n    ' +
    template.slice(end)
  );
}

function renderSitemap(pages: BuildPage[]): string {
  const urls = pages
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((page) => {
      const priority = page.slug === '/' ? '1.0' : '0.8';
      return [
        '  <url>',
        `    <loc>${canonicalUrl(page.slug)}</loc>`,
        `    <lastmod>${page.lastmod}</lastmod>`,
        `    <changefreq>weekly</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function seoPlugin(): Plugin {
  let contentDir = '';
  let outDir = '';
  return {
    name: 'manti:seo',
    apply: 'build',
    configResolved(config) {
      contentDir = join(config.root, 'src', 'content');
      outDir = join(config.root, config.build.outDir);
    },
    closeBundle() {
      const pages = collectPages(contentDir);
      if (pages.length === 0) return;

      const indexPath = join(outDir, 'index.html');
      const template = readFileSync(indexPath, 'utf8');

      for (const page of pages) {
        const html = injectHead(template, page);
        if (page.slug === '/') {
          writeFileSync(indexPath, html);
          continue;
        }
        // `/components/button` -> dist/components/button/index.html, which
        // Netlify serves for the pretty URL before the SPA catch-all.
        const target = join(outDir, page.slug.replace(/^\//, ''), 'index.html');
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, html);
      }

      writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap(pages));
      this.warn?.(
        `emitted ${pages.length} prerendered route(s) + sitemap.xml`,
      );
    },
  };
}
