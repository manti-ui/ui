// Ladle's own Vite config. Ladle bundles Vite 6 while the workspace runs
// Vite 8, so this file imports nothing from `vite` and loads no plugin built
// for Vite 8: Ladle ships its own React plugin.

const SITE = 'https://manti.design/ladle/';
const DESCRIPTION =
  'The live Ladle gallery for Manti UI: browse every component, variant, size and motion tier, with controls and a11y checks on each story.';
const TITLE = 'Manti UI Ladle: every component, live';

/**
 * Ladle's index.html is one page for every `?story=…` URL, so it carries
 * Ladle's own title, description and icon. Swap them for Manti's, and point
 * every story URL at one canonical so crawlers index the gallery once.
 * Asset paths are relative so they resolve under the `/ladle/` base.
 */
const mantiHead = {
  name: 'manti-ladle-head',
  transformIndexHtml: {
    order: 'post',
    handler: (html) =>
      html
        .replace(/<title>[^<]*<\/title>/, `<title>${TITLE}</title>`)
        .replace(
          /<meta\s+name="description"[^>]*>/,
          `<meta name="description" content="${DESCRIPTION}" />`,
        )
        .replace(
          /<link rel="icon"[^>]*>/,
          '<link rel="icon" type="image/svg+xml" href="manti-favicon.svg" />',
        )
        .replace(
          '</head>',
          [
            `<link rel="canonical" href="${SITE}" />`,
            '<meta property="og:type" content="website" />',
            '<meta property="og:site_name" content="Manti UI" />',
            `<meta property="og:title" content="${TITLE}" />`,
            `<meta property="og:description" content="${DESCRIPTION}" />`,
            `<meta property="og:url" content="${SITE}" />`,
            '<meta property="og:image" content="https://manti.design/og-cover.png" />',
            '<meta name="twitter:card" content="summary_large_image" />',
            '</head>',
          ].join('\n'),
        ),
  },
};

// Keep modern CSS (`light-dark()`, nesting) intact so the theme toggle drives
// Manti UI tokens correctly. See packages/styles/vite.config.ts.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

export default {
  // Ladle's own static files (the favicon). Without this Ladle would publish
  // the repo-root `public/`, which holds README and docs artwork.
  publicDir: '.ladle/public',
  plugins: [mantiHead],
  resolve: {
    // Read the workspace packages from source in builds too, as `ladle serve`
    // does, so `pnpm build:ladle` needs no `pnpm build:packages` first.
    conditions: ['development', 'module', 'browser'],
  },
  server: {
    watch: {
      // Manti packages are symlinked into node_modules, which Vite's watcher
      // ignores by default. Un-ignore them so edits to packages/*/src reload
      // live; the `development` export condition already serves src.
      ignored: ['!**/node_modules/@manti-ui/**'],
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: { targets: evergreen },
  },
  build: {
    cssTarget: 'chrome123',
    cssMinify: 'lightningcss',
  },
};
