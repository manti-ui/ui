import type { ComponentType } from 'react';

import demoTexts from 'virtual:manti-demo-sources';

/**
 * The demo files, loaded two ways from the same source.
 *
 * `Demo` renders the component; the page-copy Markdown inlines the raw text so
 * an agent receives the example itself rather than a `<Demo name="…" />` tag it
 * cannot resolve. Both read this one registry, so a preview and the copied code
 * can never drift.
 */
const demoModules = import.meta.glob<{ default: ComponentType }>(
  '../demos/**/*.tsx',
  { eager: true },
);

/** Demo name without extension, e.g. `button/variants`. */
export function demoComponent(name: string): ComponentType | undefined {
  return demoModules[`../demos/${name}.tsx`]?.default;
}

export function demoSource(name: string): string | undefined {
  // Read from the build-time module rather than a `?raw` glob: that query is
  // only honored in the client environment, so a glob would hand the SSR build
  // the compiled component instead of its text.
  return demoTexts[name];
}
