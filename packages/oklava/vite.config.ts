import { defineConfig } from 'vite';

// Target evergreen browsers that support `light-dark()`, CSS nesting, and
// `color-mix()` natively, so Lightning CSS preserves them instead of emitting a
// `prefers-color-scheme`-only polyfill. The panel's own stylesheet is inlined
// into the bundle as a string, so it passes through this pipeline once at build
// time and is written to the document verbatim at runtime.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: { targets: evergreen },
  },
  build: {
    cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'],
    cssMinify: 'lightningcss',
    lib: {
      entry: { index: 'src/index.ts' },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^react(?:\/.*)?$/,
        /^react-dom(?:\/.*)?$/,
        /^@manti-ui\//,
        /^@zag-js\//,
      ],
    },
  },
});
