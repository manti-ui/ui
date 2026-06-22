import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { App } from './App';
import { pages } from './pages';
import { NotFound } from './shell/NotFound';

const pageRoutes: RouteObject[] = pages.map((page) => {
  const Page = page.Component;
  if (page.slug === '/') {
    return { index: true, element: <Page /> };
  }
  return { path: page.slug.replace(/^\//, ''), element: <Page /> };
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [...pageRoutes, { path: '*', element: <NotFound /> }],
  },
]);
