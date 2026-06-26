import { readFileSync } from 'node:fs';

import mdx from '@mdx-js/rollup';
import rehypeShiki from '@shikijs/rehype';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import withToc from '@stefanprobst/rehype-extract-toc';
import react from '@vitejs/plugin-react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';

import { highlightPlugin } from './src/highlight/vite-plugin-highlight';
import { searchIndexPlugin } from './src/search/vite-plugin-search';
import { seoPlugin } from './src/seo/vite-plugin-seo';

// Evergreen browsers that support `light-dark()`, CSS nesting and `color-mix()`
// natively. Mirrors packages/styles/vite.config.ts and .storybook/main.ts so the
// imported Manti CSS keeps `data-theme` theming and the `-webkit-backdrop-filter`
// translucent prefix instead of being lowered to a prefers-color-scheme polyfill.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

// Stamp the published Manti version (from @manti-ui/react) into the bundle so the
// docs header can render a version badge that tracks the release automatically.
const mantiVersion = (
  JSON.parse(
    readFileSync(new URL('../react/package.json', import.meta.url), 'utf8'),
  ) as { version: string }
).version;

export default defineConfig({
  define: {
    __MANTI_VERSION__: JSON.stringify(mantiVersion),
  },
  plugins: [
    // MDX must run before the React plugin so `.mdx` is compiled to JSX first.
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [
            rehypeShiki,
            {
              // Dual themes emitted as CSS variables; the docs chrome switches
              // them via `[data-theme]` (see src/styles/docs.css), matching the
              // manual Manti theme toggle rather than prefers-color-scheme.
              themes: { light: 'github-light', dark: 'github-dark' },
              defaultColor: false,
            },
          ],
          withToc,
          withTocExport,
        ],
      }),
    },
    react(),
    searchIndexPlugin(),
    highlightPlugin(),
    seoPlugin(),
  ],
  server: {
    watch: {
      // The Manti packages are symlinked into node_modules, so their source is
      // reached via a `node_modules/@manti-ui/*` path — which Vite's watcher
      // ignores by default (`**/node_modules/**`). Un-ignore them so editing
      // `packages/{styles,react,…}/src` HMRs live here without a restart. The
      // `development` export condition already serves their src (not dist), so
      // no rebuild step is needed — only the watcher needs to see the files.
      ignored: ['!**/node_modules/@manti-ui/**'],
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: { targets: evergreen },
  },
  build: {
    // Evergreen ARRAY (not a single 'chrome123') so the lightningcss minify step
    // keeps `-webkit-backdrop-filter`. See CLAUDE.md build gotchas.
    cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'],
    cssMinify: 'lightningcss',
  },
});
