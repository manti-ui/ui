import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
import type { Plugin } from 'vite';

import { searchIndexPlugin } from './src/search/vite-plugin-search';
import { docDatesPlugin } from './src/seo/vite-plugin-doc-dates';

interface MdxNode {
  type?: string;
  name?: string;
  attributes?: Array<{ type?: string; name?: string; value?: unknown }>;
  children?: MdxNode[];
}

/**
 * Keep the canonical example visible on every component page.
 *
 * Component MDX files should not have to remember a presentation prop. During
 * compilation, the first flow-level `<Demo>` receives `defaultCodeOpen`; later
 * demos remain collapsed by default.
 */
function remarkOpenPrimaryComponentDemo() {
  return (tree: MdxNode, file: { path?: string }) => {
    const path = String(file.path ?? '').replaceAll('\\', '/');
    if (!path.includes('/src/content/components/')) return;

    let found = false;
    const visit = (node: MdxNode) => {
      if (found) return;
      if (node.type === 'mdxJsxFlowElement' && node.name === 'Demo') {
        node.attributes ??= [];
        node.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'defaultCodeOpen',
          value: null,
        });
        found = true;
        return;
      }
      node.children?.forEach(visit);
    };

    visit(tree);
  };
}

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

/**
 * Make `vite preview` resolve pretty URLs the way the deploy does.
 *
 * Every route is prerendered to `dist/<slug>/index.html`, and Netlify serves
 * that file for `/components/button` before any redirect applies. Vite's
 * preview server is SPA-only: it falls back to the root index.html for any
 * extensionless path, so without this the landing page is served for every
 * route locally and the prerendered pages look like they were never emitted.
 */
function previewPrettyUrls(): Plugin {
  return {
    name: 'manti:preview-pretty-urls',
    configurePreviewServer(server) {
      const outDir = join(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, _res, next) => {
        const [path = '/', search] = (req.url ?? '/').split(/(?=\?)/, 2);
        // The existence of `<path>/index.html` is the whole test — no guard on
        // the path's shape. Slugs carry dots (`/changelog/v0.6.0`), so anything
        // that treats a dotted segment as a file extension misses them.
        const clean = path.replace(/\/+$/, '');
        if (clean && existsSync(join(outDir, clean, 'index.html'))) {
          req.url = `${clean}/index.html${search ?? ''}`;
        }
        next();
      });
    },
  };
}

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
          remarkOpenPrimaryComponentDemo,
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
    docDatesPlugin(),
    previewPrettyUrls(),
  ],
  // One React instance, always. The docs resolve `@manti-ui/react` to its source
  // through the `development` condition, so React is reached through a second
  // package's node_modules as well as the docs' own.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // react-live is only reachable through the lazy `import('./DemoLive')`. If the
    // cold scan ever misses it, the dev server re-optimizes on the first "Show
    // code" and re-hashes the shared React chunk — the page then holds two React
    // copies and the live editor dies on a null hook dispatcher. Naming it here
    // keeps it in the first optimize pass instead of a mid-session one.
    include: ['react-live'],
  },
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
