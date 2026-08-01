import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router-dom';

import docDates from 'virtual:manti-doc-dates';

import { pages } from './pages';
import { routes } from './routes';
import { renderHead, renderSitemap, type BuildPage } from './seo/head';
import { canonicalUrl } from './seo/meta';

/**
 * The prerender entry: the same app, rendered to HTML strings at build time.
 *
 * `scripts/prerender.mjs` builds this file for the SSR environment, imports it,
 * and calls `prerender()` once — everything below runs in Node, never in the
 * browser bundle. The result is a real HTML document per route, which
 * `entry-client.tsx` then hydrates instead of rendering from scratch.
 */

// One handler for every render — the route tree is static, so building it per
// page would just re-walk the same 80-odd routes.
const handler = createStaticHandler(routes);

/** Page metadata joined with the git dates only Node can read. */
const buildPages: BuildPage[] = pages.map((page) => {
  const dates = docDates[page.slug];
  if (!dates) {
    throw new Error(
      `[prerender] no dates for "${page.slug}" — vite-plugin-doc-dates could ` +
        `not match its frontmatter slug. Check the slug: line in src/content.`,
    );
  }
  return {
    slug: page.slug,
    title: page.title,
    description: page.description,
    // A changelog page's frontmatter `date` is the release date — the truest
    // publish date. Otherwise the first commit that introduced the file.
    datePublished: page.date ?? dates.published,
    dateModified: dates.modified,
  };
});

async function renderRoute(slug: string): Promise<string> {
  const context = await handler.query(new Request(canonicalUrl(slug)));
  if (context instanceof Response) {
    throw new Error(
      `[prerender] "${slug}" resolved to a ${context.status} response instead ` +
        `of a page — a route redirected or threw during the static query.`,
    );
  }
  const error = Object.values(context.errors ?? {})[0];
  if (error) throw error;

  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      {/* No route has a loader, so there is no hydration state to serialize —
          the client's createBrowserRouter is fully initialized on first render.
          `hydrate={false}` keeps the inline __staticRouterHydrationData script
          (and its 'unsafe-inline' CSP dependency) out of every page. */}
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
}

export interface PrerenderedPage {
  /** Route path, e.g. `/components/button` (`/` for the landing page). */
  slug: string;
  /** Inner HTML for the managed `<!-- seo:start -->` block in index.html. */
  head: string;
  /** Rendered markup for `<div id="root">`. */
  html: string;
}

export async function prerender(): Promise<{
  pages: PrerenderedPage[];
  sitemap: string;
}> {
  const rendered: PrerenderedPage[] = [];
  for (const page of buildPages) {
    rendered.push({
      slug: page.slug,
      head: renderHead(page),
      html: await renderRoute(page.slug),
    });
  }
  return { pages: rendered, sitemap: renderSitemap(buildPages) };
}
