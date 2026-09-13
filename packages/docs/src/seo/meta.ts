/**
 * Shared SEO metadata helpers. Pure — no browser or Node APIs — so the
 * client-side head sync (`useDocumentHead`) and the build-time prerender plugin
 * (`vite-plugin-seo`) compute byte-identical titles, canonicals and tags. Keep
 * it free of imports so both the browser bundle and the Vite config can load it.
 */

/** Canonical origin the site is served from (Netlify: manti.design). */
export const SITE_URL = 'https://manti.design';
export const SITE_NAME = 'Manti UI';

/** Full default <title> — used on the home route and as the fallback. */
export const DEFAULT_TITLE =
  'Manti UI — a framework-agnostic design system on Zag.js';

export const DEFAULT_DESCRIPTION =
  'Manti UI is a framework-agnostic design system built on Zag.js behavior machines: sleek monochrome panels, semantic variants, and a token-first customization contract.';

/**
 * The one-sentence entity definition. Generative engines answer "what is X?"
 * from a self-contained sentence that names the subject, its category and a
 * fact or two, so this string leads with "Manti UI is a…" and carries numbers.
 * Reused verbatim by the JSON-LD Organization/SoftwareApplication nodes.
 */
export const ENTITY_DEFINITION =
  'Manti UI is an open-source, framework-agnostic design system for React, built on Zag.js behavior machines. It ships accessible components styled entirely from a three-tier design token contract of primitive ramps, semantic roles, and public per-component tokens, so every component can be re-themed in CSS without forking a single file.';

/**
 * Disambiguation from the near-homographs AI engines substitute for this brand.
 * Searches for "Manti UI" resolve to Mantine, Mantis UI and Mantle UI, so the
 * distinction is stated explicitly wherever a machine can read it.
 */
export const DISAMBIGUATION =
  'Manti UI (manti.design) is distinct from Mantine, Mantis UI and Mantle UI. Its behavior layer is Zag.js, and its name comes from mantı, the Turkish dumpling.';

/**
 * Social share image (absolute URL, 1200×630). PNG, not SVG — Twitter/Facebook
 * don't render SVG og:image. Source: public/og-cover.svg; raster: public/og-cover.png.
 */
export const OG_IMAGE = `${SITE_URL}/og-cover.png`;

/** Source repository: the `codeRepository` and issue-tracker root. */
export const REPO_URL = 'https://github.com/manti-ui/ui';

/**
 * Public profiles for the JSON-LD Organization `sameAs` — the E-E-A-T trust
 * signal AI crawlers and search engines use to connect the site to its source.
 * Three or more reciprocating profiles is the threshold engines score against,
 * so the GitHub organization and the npm scope are listed alongside the repo.
 */
export const ORG_PROFILES = [
  REPO_URL,
  'https://github.com/manti-ui',
  'https://www.npmjs.com/package/@manti-ui/react',
  'https://www.npmjs.com/org/manti-ui',
];

/**
 * The maintainer entity. AI engines score an Organization-only `author` as an
 * entity reference rather than authored expertise, so pages carry a Person.
 */
export const AUTHOR = {
  name: 'Tutku Ucan',
  url: 'https://github.com/tutkuofnight',
  jobTitle: 'Maintainer, Manti UI',
  sameAs: ['https://github.com/tutkuofnight', 'https://github.com/manti-ui'],
};

/** The minimal page shape both the renderer and the build plugin can supply. */
export interface PageMeta {
  slug: string;
  title: string;
  description?: string;
}

/**
 * Per-page <title>. The home route keeps the full brand title; every other page
 * gets `Title · Manti UI` — short, unique, and safe under SERP truncation.
 */
export function pageTitle(page: PageMeta): string {
  if (page.slug === '/') return DEFAULT_TITLE;
  return `${page.title} · ${SITE_NAME}`;
}

/** Per-page description, falling back to the site default when none is set. */
export function pageDescription(page: PageMeta): string {
  const desc = page.description?.trim();
  return desc && desc.length > 0 ? desc : DEFAULT_DESCRIPTION;
}

/**
 * Absolute URL for a slug, with no trailing slash: the form the router and the
 * prerenderer address routes by. Use `canonicalUrl` for anything a crawler
 * reads; the deploy 301s the slash-less form.
 */
export function routeUrl(slug: string): string {
  if (slug === '/' || slug === '') return SITE_URL;
  return SITE_URL + slug;
}

/**
 * Absolute canonical URL, with the trailing slash the deploy actually serves.
 *
 * Netlify's pretty URLs 301 `/components/button` to `/components/button/`, so
 * emitting the slash-less form in `<link rel="canonical">` and in sitemap.xml
 * points every crawler at a redirect instead of at the document. The canonical
 * target must be the final URL, not a hop.
 */
export function canonicalUrl(slug: string): string {
  if (slug === '/' || slug === '') return `${SITE_URL}/`;
  return `${SITE_URL}${slug}/`;
}
