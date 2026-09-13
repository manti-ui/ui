import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router-dom';

import docDates from 'virtual:manti-doc-dates';

import { pageBySlug, pages } from './pages';
import { routes } from './routes';
import {
  renderHead,
  renderNotFoundHead,
  renderSitemap,
  type BuildPage,
} from './seo/head';
import { SITE_URL, canonicalUrl, routeUrl } from './seo/meta';

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

/**
 * The section index a nested route sits under, when that index is itself a
 * page. `/components/button` resolves to Components; `/guides/tailwind` has no
 * `/guides` page and resolves to nothing rather than inventing a dead URL.
 */
function sectionOf(slug: string): { title: string; slug: string } | undefined {
  const segments = slug.split('/').filter(Boolean);
  if (segments.length < 2) return undefined;
  const parent = pageBySlug.get(`/${segments[0]}`);
  return parent ? { title: parent.title, slug: parent.slug } : undefined;
}

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
    section: sectionOf(page.slug),
    faq: page.faq,
    howto: page.howto,
    // A changelog page's frontmatter `date` is the release date — the truest
    // publish date. Otherwise the first commit that introduced the file.
    datePublished: page.date ?? dates.published,
    dateModified: dates.modified,
  };
});

async function renderRoute(slug: string): Promise<string> {
  const context = await handler.query(new Request(routeUrl(slug)));
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

/**
 * The whole documentation corpus as one plain-text file.
 *
 * `/llms.txt` is the short map an agent reads first; `/llms-full.txt` is the
 * long form it fetches when it needs the actual prose. Every route is already
 * prerendered, so the full text costs one concatenation of the MDX sources,
 * and an agent that fetches it once stops crawling 94 HTML documents.
 */
function renderLlmsFull(): string {
  const header = [
    '# Manti UI: full documentation',
    '',
    '> Manti UI is an open-source, framework-agnostic design system for React.',
    '> Component behavior comes from Zag.js state machines and every visual',
    '> value resolves from a three-tier design token contract.',
    '',
    `Source: ${SITE_URL}. Short map for agents: ${SITE_URL}/llms.txt.`,
    'Every section below is one documentation page, in sidebar order, as its',
    'original Markdown. JSX component tags mark rendered demos.',
    '',
  ].join('\n');

  const body = pages.map((page) => {
    const source = page.source;
    const lines = ['---', ''];
    // Most pages open with their own `# Title`; only add one where the body
    // has none, so no section is introduced by two identical headings.
    if (!source.startsWith('# ')) lines.push(`# ${page.title}`, '');
    lines.push(`URL: ${canonicalUrl(page.slug)}`);
    if (page.description) lines.push(`Summary: ${page.description}`);
    lines.push('', source, '');
    return lines.join('\n');
  });

  return `${header}\n${body.join('\n')}`;
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
  notFound: { head: string; html: string };
  sitemap: string;
  llmsFull: string;
}> {
  const rendered: PrerenderedPage[] = [];
  for (const page of buildPages) {
    rendered.push({
      slug: page.slug,
      head: renderHead(page),
      html: await renderRoute(page.slug),
    });
  }
  return {
    pages: rendered,
    // Any unmatched path renders the NotFound route; the deploy serves this
    // document with a real 404 status instead of the SPA shell.
    notFound: {
      head: renderNotFoundHead(),
      html: await renderRoute('/__not-found__'),
    },
    sitemap: renderSitemap(buildPages),
    llmsFull: renderLlmsFull(),
  };
}
