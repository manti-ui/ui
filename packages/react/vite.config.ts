import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // Multi-entry: the root package plus the standalone `@manti-ui/react/shortcut`
      // subpath. Output file names follow the entry keys (`index.js`, `shortcut.js`).
      entry: {
        index: 'src/index.ts',
        shortcut: 'src/shortcut/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^react(?:\/.*)?$/,
        /^react-dom(?:\/.*)?$/,
        /^@manti-ui\//,
        /^@zag-js\//,
        /^@tanstack\//,
      ],
    },
  },
});
