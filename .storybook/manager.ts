import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Brand the Storybook manager (sidebar + toolbar) as Manti UI. The cool-dark
// `base: 'dark'` matches Manti UI's monochrome design signature, so the white
// wordmark in `assets/manti-wordmark.svg` reads cleanly. The asset is served
// from the repo `.storybook/assets` dir via `staticDirs` in `main.ts`.
const mantiTheme = create({
  base: 'dark',
  brandTitle: 'Manti UI',
  brandImage: 'manti-wordmark.svg',
  brandUrl: '/',
  brandTarget: '_self',
});

addons.setConfig({ theme: mantiTheme });
