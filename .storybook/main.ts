import type { StorybookConfig } from '@storybook/react-vite';

// Keep modern CSS (`light-dark()`, nesting) intact so the Storybook theme toggle
// drives Manti UI tokens correctly. See packages/styles/vite.config.ts.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

/** Files whose props Storybook should document: the React adapter's own source. */
const DOCGEN_SOURCE = /[\\/]packages[\\/]react[\\/]src[\\/]/;

/**
 * Keep react-docgen off everything but `packages/react/src`.
 *
 * Workspace packages are served from source through the `development` export
 * condition, so a first-party file that imports the `@manti-ui/react` barrel
 * makes docgen resolve every component in a single graph, and Babel's traversal
 * overflows its stack. The adapter's own components import each other by
 * relative path and are unaffected, and they are the only ones whose prop tables
 * the autodocs pages render.
 */
function narrowDocgen(viteConfig: { plugins?: unknown[] }): void {
  const plugins = (viteConfig.plugins ?? []).flat(Infinity) as {
    name?: string;
    transform?: unknown;
  }[];
  const docgen = plugins.find(
    (plugin) => plugin?.name === 'storybook:react-docgen-plugin',
  );
  if (!docgen?.transform) return;

  const skip = (id: string) => !DOCGEN_SOURCE.test(id);
  const { transform } = docgen;
  if (typeof transform === 'function') {
    docgen.transform = function (this: unknown, code: string, id: string) {
      if (skip(id)) return null;
      return (transform as (c: string, i: string) => unknown).call(
        this,
        code,
        id,
      );
    };
  } else {
    const hook = transform as { handler?: (c: string, i: string) => unknown };
    const handler = hook.handler;
    if (!handler) return;
    hook.handler = function (this: unknown, code: string, id: string) {
      if (skip(id)) return null;
      return handler.call(this, code, id);
    };
  }
}

const config: StorybookConfig = {
  stories: [
    '../packages/react/src/**/*.mdx',
    '../packages/react/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/oklava/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  // Serve the Manti UI brand assets (sidebar wordmark + favicon) at the site
  // root so `manager.ts` / `manager-head.html` can reference them.
  staticDirs: ['./assets'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite');
    narrowDocgen(viteConfig);
    return mergeConfig(viteConfig, {
      server: {
        watch: {
          // Manti packages are symlinked into node_modules, so their source is
          // reached via `node_modules/@manti-ui/*` — which Vite's watcher
          // ignores by default. Un-ignore it so edits to packages/*/src HMR live
          // here without a restart. (The `development` export condition already
          // serves src, not dist, so no rebuild step is needed.)
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
    });
  },
};

export default config;
