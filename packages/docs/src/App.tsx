import { MDXProvider } from '@mdx-js/react';
import { Outlet, useLocation } from 'react-router-dom';

import { mdxComponents } from './mdx/MDXComponents';
import { pageBySlug, slugFromPath } from './pages';
import { SearchProvider } from './search/SearchProvider';
import { Footer } from './shell/Footer';
import { SearchDialog } from './shell/SearchDialog';
import { Sidebar } from './shell/Sidebar';
import { TableOfContents } from './shell/TableOfContents';
import { TopNav } from './shell/TopNav';

export function App() {
  const { pathname } = useLocation();
  const slug = slugFromPath(pathname);
  const page = pageBySlug.get(slug);
  const isLanding = slug === '/';

  return (
    <MDXProvider components={mdxComponents}>
      <SearchProvider>
        <div className="docs-root">
          <TopNav />
          {isLanding ? (
            <main>
              <Outlet />
              <Footer />
            </main>
          ) : (
            <div className="docs-layout">
              <Sidebar />
              <main className="docs-content">
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
