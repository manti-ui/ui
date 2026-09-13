/**
 * The `<head>` a crawler receives, rendered as a string.
 *
 * Kept pure — no browser and no Node APIs — because it runs inside the SSR
 * bundle during prerendering (see scripts/prerender.mjs) alongside the React
 * render of the same page. `useDocumentHead` mirrors these tags on client
 * navigation; both read `meta.ts`, so the two can't drift.
 *
 * The JSON-LD below is written for generative engines as much as for search:
 * every page carries the Organization/WebSite identity graph, a TechArticle
 * with a Person author and a `speakable` block, and, where the page declares
 * them, the `FAQPage` and `HowTo` types AI answers are assembled from.
 */

import {
  AUTHOR,
  DEFAULT_DESCRIPTION,
  DISAMBIGUATION,
  ENTITY_DEFINITION,
  OG_IMAGE,
  ORG_PROFILES,
  REPO_URL,
  SITE_NAME,
  SITE_URL,
  canonicalUrl,
  pageDescription,
  pageTitle,
  type PageMeta,
} from './meta';
import type { FaqEntry, HowTo } from '../types';

export interface BuildPage extends PageMeta {
  /** ISO date (yyyy-mm-dd) the page first appeared. */
  datePublished: string;
  /** ISO date (yyyy-mm-dd) of the page's last edit. */
  dateModified: string;
  /**
   * The section index this page sits under, when one exists as a real page
   * (`/components`, `/typography`, `/foundations`). Supplies the middle tier of
   * the breadcrumb trail; a two-level trail on a three-level route drops the
   * category an engine would otherwise use to place the page.
   */
  section?: { title: string; slug: string };
  /** Q&A pairs: rendered on the page AND emitted as `FAQPage`. */
  faq?: FaqEntry[];
  /** Step-by-step instructions, emitted as `HowTo`. */
  howto?: HowTo;
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

/**
 * Publisher/author identity: the E-E-A-T signal connecting every page to the
 * project's public profiles (GitHub org, repo, npm). `alternateName` and
 * `disambiguatingDescription` exist because "Manti UI" collides with Mantine,
 * Mantis UI and Mantle UI in every search index, and an engine with no
 * corroborating record answers with the better-known neighbour.
 */
const organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ['Manti', 'Mantı UI', '@manti-ui'],
  disambiguatingDescription: DISAMBIGUATION,
  url: SITE_URL,
  description: ENTITY_DEFINITION,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/manti.svg`,
  },
  sameAs: ORG_PROFILES,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'technical support',
    url: `${REPO_URL}/issues`,
  },
};

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#author`,
  name: AUTHOR.name,
  url: AUTHOR.url,
  jobTitle: AUTHOR.jobTitle,
  sameAs: AUTHOR.sameAs,
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

/**
 * The library itself as an entity. Version, license, repository and runtime are
 * exactly the fields an assistant reads back when asked to recommend or install
 * a component library, so none of them is optional.
 */
function softwareApplication(page: BuildPage) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: SITE_NAME,
    alternateName: '@manti-ui/react',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'UI Component Library',
    operatingSystem: 'Web',
    description: ENTITY_DEFINITION,
    disambiguatingDescription: DISAMBIGUATION,
    url: SITE_URL,
    softwareVersion: __MANTI_VERSION__,
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    license: `${REPO_URL}/blob/main/LICENSE`,
    codeRepository: REPO_URL,
    programmingLanguage: ['TypeScript', 'CSS'],
    runtimePlatform: 'React',
    softwareRequirements: 'React 18 or 19',
    downloadUrl: 'https://www.npmjs.com/package/@manti-ui/react',
    installUrl: `${SITE_URL}/getting-started/`,
    screenshot: OG_IMAGE,
    featureList: [
      'Accessible React components driven by Zag.js behavior machines',
      'Three-tier design token contract: primitive ramps, semantic roles, per-component tokens',
      'Public, semver-stable --manti-{component}-{property} override tokens',
      'Theme-aware light and dark roles with an automated WCAG contrast gate',
      'Tailwind CSS v4 theme bridge, and a plain-CSS path with no utility framework',
      'No CSS side effects on import; the stylesheet is a separate package',
    ],
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://www.npmjs.com/package/@manti-ui/react',
    },
  };
}

/** Home → [Section] → Page. The middle tier appears only when it is a real page. */
function breadcrumb(page: BuildPage) {
  const trail: unknown[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
  ];
  if (page.section) {
    trail.push({
      '@type': 'ListItem',
      position: 2,
      name: page.section.title,
      item: canonicalUrl(page.section.slug),
    });
  }
  trail.push({
    '@type': 'ListItem',
    position: trail.length + 1,
    name: page.title,
    item: canonicalUrl(page.slug),
  });
  return { '@type': 'BreadcrumbList', itemListElement: trail };
}

function faqPage(faq: FaqEntry[], page: BuildPage) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl(page.slug)}#faq`,
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  };
}

function howTo(howto: HowTo, page: BuildPage) {
  const url = canonicalUrl(page.slug);
  return {
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: howto.name,
    description: howto.description ?? pageDescription(page),
    url,
    ...(howto.totalTime ? { totalTime: howto.totalTime } : {}),
    ...(howto.tool
      ? { tool: howto.tool.map((name) => ({ '@type': 'HowToTool', name })) }
      : {}),
    ...(howto.supply
      ? {
          supply: howto.supply.map((name) => ({
            '@type': 'HowToSupply',
            name,
          })),
        }
      : {}),
    step: howto.step.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.anchor ? { url: `${url}#${step.anchor}` } : {}),
    })),
  };
}

function structuredData(page: BuildPage): string {
  if (page.slug === '/') {
    return jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        person,
        website,
        softwareApplication(page),
        ...(page.faq ? [faqPage(page.faq, page)] : []),
      ],
    });
  }
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      person,
      website,
      {
        '@type': 'TechArticle',
        headline: pageTitle(page),
        description: pageDescription(page),
        url: canonicalUrl(page.slug),
        image: OG_IMAGE,
        inLanguage: 'en',
        datePublished: page.datePublished,
        dateModified: page.dateModified,
        author: { '@id': `${SITE_URL}/#author` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: canonicalUrl(page.slug),
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#software` },
        // The passages an assistant should read back for this page: its title
        // and the prose paragraphs directly under the article root.
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.docs-prose > p'],
        },
      },
      breadcrumb(page),
      ...(page.faq ? [faqPage(page.faq, page)] : []),
      ...(page.howto ? [howTo(page.howto, page)] : []),
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
    // Agents that read a page before deciding whether to fetch the whole site.
    `<link rel="alternate" type="text/plain" href="${SITE_URL}/llms.txt" title="Manti UI for coding agents" />`,
    structuredData(page),
  );
  return tags.join('\n    ');
}

/**
 * The `<head>` for the 404 document.
 *
 * The deploy serves it for every unmatched URL with a real 404 status (see
 * netlify.toml). Without it the SPA fallback answered 200 for any path, which
 * let crawlers and AI agents index unlimited non-existent URLs as valid pages.
 */
export function renderNotFoundHead(): string {
  return [
    `<title>Page not found · ${SITE_NAME}</title>`,
    `<meta name="description" content="This page does not exist on ${SITE_NAME}." />`,
    `<meta name="robots" content="noindex, follow" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="Page not found · ${SITE_NAME}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
  ].join('\n    ');
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
