// Ladle's own Vite config. Ladle bundles Vite 6 while the workspace runs
// Vite 8, so this mirrors `viteFinal` in `.storybook/main.ts` without
// importing from `vite`, and loads no plugin built for Vite 8: Ladle ships its
// own React plugin.

// Keep modern CSS (`light-dark()`, nesting) intact so the theme toggle drives
// Manti UI tokens correctly. See packages/styles/vite.config.ts.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

export default {
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
