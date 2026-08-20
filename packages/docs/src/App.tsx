import { useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Outlet, useLocation } from 'react-router-dom';

import { mdxComponents } from './mdx/MDXComponents';
import { pageBySlug, slugFromPath } from './pages';
import { SearchProvider } from './search/SearchProvider';
import { useDocumentHead } from './seo/useDocumentHead';
import { Footer } from './shell/Footer';
import { SearchDialog } from './shell/SearchDialog';
import { Sidebar } from './shell/Sidebar';
import { TableOfContents } from './shell/TableOfContents';
import { TopNav } from './shell/TopNav';
import Clarity from '@microsoft/clarity';

export function App() {
  const { pathname, hash } = useLocation();
  const slug = slugFromPath(pathname);
  const page = pageBySlug.get(slug);
  const isLanding = slug === '/';

  // Sync per-route <title>/description/canonical/OG tags on client navigation.
  useDocumentHead(page);
  Clarity.init("y5gqk1fv09");
  // The page scrolls on the window (sidebar/TOC are sticky), and react-router
  // keeps the old scroll offset across client navigations. Reset to the top on
  // every route change so a sidebar click starts the new page from its heading —
  // but leave in-page anchor jumps (TOC links carry a hash) alone.
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return (
    <MDXProvider components={mdxComponents}>
      <SearchProvider>
        <div className="docs-root">
          <a
            className="docs-skip-link"
            href="#main-content"
            onClick={() => document.getElementById('main-content')?.focus()}
          >
            Skip to main content
          </a>
          <TopNav />
          {isLanding ? (
            <main id="main-content" className="docs-main" tabIndex={-1}>
              <Outlet />
              <Footer />
            </main>
          ) : (
            <div className="docs-layout">
              <Sidebar />
              <main
                id="main-content"
                className="docs-main docs-content"
                tabIndex={-1}
              >
                <article className="docs-prose">
                  <Outlet />
                </article>
                <Footer />
              </main>
              <TableOfContents toc={page?.toc ?? []} />
            </div>
          )}
          <SearchDialog />
        </div>
      </SearchProvider>
    </MDXProvider>
  );
}
