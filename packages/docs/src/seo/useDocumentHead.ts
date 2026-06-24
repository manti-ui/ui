import { useEffect } from 'react';

import {
  OG_IMAGE,
  SITE_NAME,
  canonicalUrl,
  pageDescription,
  pageTitle,
  type PageMeta,
} from './meta';

/**
 * Keeps the document <head> correct as the SPA navigates between routes.
 *
 * The build-time plugin (`vite-plugin-seo`) bakes the right tags into the static
 * HTML each crawler first receives; this hook mutates those same tags in place on
 * client navigation so Google's renderer, the browser tab, and social re-scrapes
 * stay accurate after hydration. It upserts (never duplicates) by reusing the
 * elements the static HTML already shipped.
 */

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useDocumentHead(page: PageMeta | undefined) {
  useEffect(() => {
    // Unknown route (404): tell crawlers not to index, and stop — there is no
    // canonical URL to point at.
    if (!page) {
      document.title = `Page not found · ${SITE_NAME}`;
      upsertMeta('name', 'robots', 'noindex, follow');
      return;
    }

    // Clear any stale noindex left by a previous 404 view.
    document.head.querySelector('meta[name="robots"]')?.remove();

    const title = pageTitle(page);
    const description = pageDescription(page);
    const url = canonicalUrl(page.slug);
    const ogType = page.slug === '/' ? 'website' : 'article';

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', OG_IMAGE);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', OG_IMAGE);
  }, [page]);
}
