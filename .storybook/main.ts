import type { StorybookConfig } from '@storybook/react-vite';

// Keep modern CSS (`light-dark()`, nesting) intact so the Storybook theme toggle
// drives Manti UI tokens correctly. See packages/styles/vite.config.ts.
const evergreen = {
  chrome: 123 << 16,
  edge: 123 << 16,
  firefox: 120 << 16,
  safari: (17 << 16) | (5 << 8),
};

const config: StorybookConfig = {
  stories: [
    '../packages/react/src/**/*.mdx',
    '../packages/react/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
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
    return mergeConfig(viteConfig, {
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
