import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// The single source of Manti's look — identical to .storybook/preview.tsx, so
// the docs site renders with the exact same tokens, components and motion.
import '@manti-ui/styles/index.css';
// The scoped presets, so the theme gallery can preview each one in place.
import '@manti-ui/styles/themes.css';
import './styles/docs.css';

import { routes } from './routes';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

const app = (
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </StrictMode>
);

// A production build ships prerendered markup inside #root (see
// scripts/prerender.mjs), so the app hydrates it. `vite dev` serves the bare
// index.html, where there is nothing to hydrate — hydrating an empty container
// would log a mismatch and throw the server tree away, so mount fresh instead.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
