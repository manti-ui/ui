import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// The single source of Manti's look — identical to .storybook/preview.tsx, so
// the docs site renders with the exact same tokens, components and motion.
import '@manti-ui/styles/index.css';
import './styles/docs.css';

import { router } from './router';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
