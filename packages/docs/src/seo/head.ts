/**
 * The `<head>` a crawler receives, rendered as a string.
 *
 * Kept pure — no browser and no Node APIs — because it runs inside the SSR
 * bundle during prerendering (see scripts/prerender.mjs) alongside the React
 * render of the same page. `useDocumentHead` mirrors these tags on client
 * navigation; both read `meta.ts`, so the two can't drift.
 */

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

export interface BuildPage extends PageMeta {
  /** ISO date (yyyy-mm-dd) the page first appeared. */
  datePublished: string;
  /** ISO date (yyyy-mm-dd) of the page's last edit. */
  dateModified: string;
}

export function escapeHtml(value: string): string {
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
export function renderHead(page: BuildPage): string {
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

export function renderSitemap(pages: BuildPage[]): string {
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
