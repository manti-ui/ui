import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig, type Plugin } from 'vite';

// Target evergreen browsers that support `light-dark()`, CSS nesting, and
// `color-mix()` natively, so Lightning CSS preserves them instead of emitting a
// `prefers-color-scheme`-only polyfill that would ignore manual `data-theme`
// overrides.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

// Shipped verbatim, outside the library bundle: `tokens.css` so headless
// consumers can pull the token vocabulary alone, and the Tailwind entries
// because `@theme` must survive untouched for the consumer's Tailwind v4
// pipeline (Lightning CSS would not preserve it).
const standaloneCss = ['tokens.css', 'tailwind.css', 'tailwind-theme.css'];

function emitStandaloneCss(): Plugin {
  return {
    name: 'manti:emit-standalone-css',
    generateBundle() {
      for (const fileName of standaloneCss) {
        this.emitFile({
          type: 'asset',
          fileName,
          source: readFileSync(
            resolve(import.meta.dirname, 'src', fileName),
            'utf8',
          ),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [emitStandaloneCss()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: evergreen,
    },
  },
  build: {
    // Must mirror the evergreen set above: the lightningcss minify step derives
    // its prefixing targets from cssTarget. Chrome-only would strip the
    // `-webkit-backdrop-filter` Safari ≤17 needs for the translucent surfaces.
    // safari17.5 keeps that prefix AND still preserves `light-dark()` (supported
    // from 17.5), so the documented theming behavior is unaffected.
    cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'],
    cssMinify: 'lightningcss',
    lib: {
      cssFileName: 'index',
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['@manti-ui/tokens'],
    },
  },
});
