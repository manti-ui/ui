import { execSync } from 'node:child_process';
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

import type { Plugin } from 'vite';

import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  ORG_PROFILES,
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
 *      JSON-LD (with publisher + datePublished/dateModified freshness signals
 *      taken from git history) — so crawlers and social unfurlers that read raw
 *      HTML (Bing, Slack, X, AI bots) get correct metadata without executing JS;
 *   2. injects a static fallback into `<div id="root">` — the page's h1,
 *      description, and a grouped nav linking every route — so no page is an
 *      orphan for raw-HTML crawlers and the site works without JavaScript.
 *      React's `createRoot().render()` replaces it the moment the app mounts;
 *   3. emits `dist/sitemap.xml` listing every canonical URL (plus /storybook/).
 *
 * The managed head block in index.html is delimited by `<!-- seo:start -->` /
 * `<!-- seo:end -->`; the plugin swaps its contents per page. Netlify serves the
 * nested static files before the SPA fallback, so `/components/button` gets its
 * own HTML while client-side routing still works.
 */

const SEO_START = '<!-- seo:start -->';
const SEO_END = '<!-- seo:end -->';
const ROOT_MARKER = '<div id="root"></div>';

/**
 * Sidebar group order for the static fallback nav. Mirrors
 * `src/data/navigation.ts` (which can't be imported here — it reads
 * `import.meta.glob` modules that only exist inside the Vite pipeline).
 * Keep the two lists in sync when adding a group.
 */
const COMPONENT_CATEGORIES = [
  'Inputs',
  'Buttons & Actions',
  'Navigation',
  'Overlays',
  'Feedback',
  'Data Display',
  'Layout',
];
const GROUP_ORDER = [
  'Overview',
  'Getting Started',
  'Foundations',
  'Guides',
  'Components',
  ...COMPONENT_CATEGORIES,
  'Reference',
  'Changelog',
];

interface BuildPage extends PageMeta {
  group: string;
  order: number;
  /** ISO date (yyyy-mm-dd) of the first commit touching the source file. */
  datePublished: string;
  /** ISO date (yyyy-mm-dd) of the last commit touching the source file. */
  dateModified: string;
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

/**
 * First/last commit dates (yyyy-mm-dd) for a file, from git history. Returns
 * null when git is unavailable or the file has no commits yet (fresh file,
 * tarball deploy) — callers fall back to the filesystem mtime.
 */
function gitDates(file: string): { first: string; last: string } | null {
  try {
    const out = execSync(`git log --follow --format=%cs -- "${file}"`, {
      cwd: dirname(file),
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
    if (!out) return null;
    const lines = out.split('\n');
    return { last: lines[0], first: lines[lines.length - 1] };
  } catch {
    return null;
  }
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
    const mtime = statSync(file).mtime.toISOString().slice(0, 10);
    const git = gitDates(file);
    pages.push({
      slug: data.slug,
      title: data.title ?? data.slug,
      description: data.description,
      group: data.group ?? '',
      order: Number(data.order ?? 0),
      // A changelog page's frontmatter `date` is the release date — the truest
      // publish date. Otherwise: first commit, else file mtime.
      datePublished: data.date ?? git?.first ?? mtime,
      dateModified: git?.last ?? mtime,
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

function structuredData(page: BuildPage): string {
  // Publisher/author identity — the E-E-A-T signal connecting every page to the
  // project's public profiles (GitHub, npm).
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/manti.svg`,
    },
    sameAs: ORG_PROFILES,
  };
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  if (page.slug === '/') {
    return jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        website,
        {
          '@type': 'SoftwareApplication',
          name: SITE_NAME,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          description: DEFAULT_DESCRIPTION,
          url: SITE_URL,
          datePublished: page.datePublished,
          dateModified: page.dateModified,
          author: { '@id': `${SITE_URL}/#organization` },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
    });
  }
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      {
        '@type': 'TechArticle',
        headline: pageTitle(page),
        description: pageDescription(page),
        url: canonicalUrl(page.slug),
        image: OG_IMAGE,
        datePublished: page.datePublished,
        dateModified: page.dateModified,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: canonicalUrl(page.slug),
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
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
function renderHead(page: BuildPage): string {
  const title = escapeHtml(pageTitle(page));
  const description = escapeHtml(pageDescription(page));
  const url = canonicalUrl(page.slug);
  const isArticle = page.slug !== '/';
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
  ];
  if (isArticle) {
    // Content-freshness signals for crawlers that read og/article tags rather
    // than JSON-LD. Same dates as the TechArticle node below.
    tags.push(
      `<meta property="article:published_time" content="${page.datePublished}" />`,
      `<meta property="article:modified_time" content="${page.dateModified}" />`,
    );
  }
  tags.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    structuredData(page),
  );
  return tags.join('\n    ');
}

/**
 * Static no-JS fallback rendered inside `<div id="root">`: the page's own
 * heading + description and a grouped nav linking every route. This is what
 * raw-HTML crawlers index — without it every page is an orphan (zero incoming
 * internal links), because the real nav only exists after React mounts.
 */
function renderFallback(page: BuildPage, pages: BuildPage[]): string {
  const groups = GROUP_ORDER.map((label) => {
    let items = pages.filter((p) => p.group === label);
    items = COMPONENT_CATEGORIES.includes(label)
      ? items.sort((a, b) => a.title.localeCompare(b.title))
      : items.sort((a, b) => a.order - b.order);
    return { label, items };
  }).filter((group) => group.items.length > 0);

  const sections = groups
    .map(({ label, items }) => {
      const links = items
        .map(
          (p) =>
            `<li><a href="${p.slug === '/' ? '/' : escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></li>`,
        )
        .join('');
      return `<section><h2>${escapeHtml(label)}</h2><ul>${links}</ul></section>`;
    })
    .join('');

  return [
    `<div class="docs-seo-fallback">`,
    `<p><a href="/">${SITE_NAME}</a></p>`,
    `<h1>${escapeHtml(page.title)}</h1>`,
    `<p>${escapeHtml(pageDescription(page))}</p>`,
    `<nav aria-label="All documentation pages">`,
    sections,
    `<section><h2>Resources</h2><ul>`,
    `<li><a href="/storybook/">Storybook</a></li>`,
    `<li><a href="${ORG_PROFILES[0]}" rel="noreferrer">GitHub</a></li>`,
    `</ul></section>`,
    `</nav>`,
    `</div>`,
  ].join('');
}

function injectHead(template: string, page: BuildPage): string {
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

function injectBody(
  template: string,
  page: BuildPage,
  pages: BuildPage[],
): string {
  if (!template.includes(ROOT_MARKER)) {
    throw new Error(
      `[manti:seo] index.html is missing the ${ROOT_MARKER} mount point`,
    );
  }
  return template.replace(
    ROOT_MARKER,
    `<div id="root">${renderFallback(page, pages)}</div>`,
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
        `    <lastmod>${page.dateModified}</lastmod>`,
        `    <changefreq>weekly</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    });
  // Storybook ships in the same deploy at /storybook/ (see netlify.toml); list
  // it so it isn't a crawled-but-unlisted page.
  const storybookLastmod = pages
    .map((p) => p.dateModified)
    .sort()
    .at(-1);
  urls.push(
    [
      '  <url>',
      `    <loc>${SITE_URL}/storybook/</loc>`,
      `    <lastmod>${storybookLastmod}</lastmod>`,
      `    <changefreq>weekly</changefreq>`,
      `    <priority>0.5</priority>`,
      '  </url>',
    ].join('\n'),
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
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
        const html = injectBody(injectHead(template, page), page, pages);
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
      this.warn?.(`emitted ${pages.length} prerendered route(s) + sitemap.xml`);
    },
  };
}
