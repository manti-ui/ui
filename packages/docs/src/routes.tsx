import type { RouteObject } from 'react-router-dom';

import { App } from './App';
import { pages } from './pages';
import { NotFound } from './shell/NotFound';

/**
 * The route table, shared by both entries.
 *
 * `entry-client.tsx` feeds it to `createBrowserRouter` and `entry-server.tsx`
 * feeds the same array to `createStaticHandler`, so a prerendered page and its
 * hydrated counterpart can never disagree about what renders where — which is
 * exactly what a hydration mismatch is.
 *
 * Every route is eager (`element`, not `lazy`): `pages.ts` glob-imports the MDX
 * modules synchronously, so the router is fully initialized on its first render
 * in both environments and needs no hydration data handed across.
 */
const pageRoutes: RouteObject[] = pages.map((page) => {
  const Page = page.Component;
  if (page.slug === '/') {
    return { index: true, element: <Page /> };
  }
  return { path: page.slug.replace(/^\//, ''), element: <Page /> };
});

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [...pageRoutes, { path: '*', element: <NotFound /> }],
  },
];
