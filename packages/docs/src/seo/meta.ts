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
  'Manti UI is a framework-agnostic design system built on Zag.js behavior machines: sleek monochrome panels, semantic tones, and a token-first customization contract.';

/**
 * Social share image (absolute URL, 1200×630). PNG, not SVG — Twitter/Facebook
 * don't render SVG og:image. Source: public/og-cover.svg; raster: public/og-cover.png.
 */
export const OG_IMAGE = `${SITE_URL}/og-cover.png`;

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

/** Absolute canonical URL with no trailing slash (matches the registered slugs). */
export function canonicalUrl(slug: string): string {
  if (slug === '/' || slug === '') return SITE_URL;
  return SITE_URL + slug;
}
