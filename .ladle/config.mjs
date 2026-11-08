import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The same sources Storybook reads (`.storybook/main.ts`): stories under
 * `packages/react/src` and `packages/oklava/src`. Ladle only recognises MDX
 * stories named `*.stories.mdx`.
 */
const STORY_ROOTS = ['packages/react/src', 'packages/oklava/src'];
const STORY_FILE = /\.stories\.(tsx|mdx)$/;

/**
 * While both galleries run, a story file joins Ladle once it is in the shared
 * format (see `packages/react/src/components/README.md`). A file that still
 * imports `@storybook/*` is Storybook's CSF3, which Ladle cannot parse: one
 * such file stops Ladle's story discovery for the whole gallery.
 */
const isConverted = (file) =>
  !readFileSync(file, 'utf8').includes('@storybook/');

const stories = STORY_ROOTS.flatMap((root) =>
  readdirSync(root, { recursive: true })
    .map((file) => join(root, String(file)))
    .filter((file) => STORY_FILE.test(file) && isConverted(file)),
).sort();

/** @type {import('@ladle/react').UserConfig} */
export default {
  // Ladle globs this list as it would one pattern, though `UserConfig` types
  // it as a string.
  stories,
  /**
   * Sidebar groups in Storybook's order (`storySort` in
   * `.storybook/preview.tsx`). Ladle hands this the story ids sorted
   * alphabetically, so a stable sort on the group alone keeps that order
   * inside each group. Ladle serializes the function into the browser bundle,
   * so it must not reach anything outside its own body.
   *
   * @param {string[]} ids
   */
  storyOrder: (ids) => {
    const groups = ['getting-started', 'foundations', 'components'];
    const rank = (id) => {
      const index = groups.indexOf(id.split('--')[0]);
      return index === -1 ? groups.length : index;
    };
    return [...ids].sort((a, b) => rank(a) - rank(b));
  },
  // Ladle runs its own Vite 6; this file holds the Ladle-only settings.
  viteConfig: '.ladle/vite.config.mjs',
  port: 61000,
  // Served from manti.design/ladle.
  base: '/ladle/',
  outDir: 'ladle-static',
  addons: {
    a11y: { enabled: true },
  },
};
