import { useEffect } from 'react';
import type { ArgTypes, GlobalProvider } from '@ladle/react';

import '@manti-ui/styles/index.css';
import './components.css';

const RADIUS_MODES = ['none', 'sharp', 'default', 'round', 'pill'] as const;
type RadiusMode = (typeof RADIUS_MODES)[number];

const LAYOUTS = ['centered', 'padded', 'fullscreen'] as const;
type Layout = (typeof LAYOUTS)[number];

const isRadiusMode = (value: unknown): value is RadiusMode =>
  RADIUS_MODES.includes(value as RadiusMode);

const isLayout = (value: unknown): value is Layout =>
  LAYOUTS.includes(value as Layout);

/**
 * The radius preset, a global control because Ladle has no custom toolbar.
 * `none` is the revealing one: a part that stays round there is reading
 * `--manti-radius-full` when it should be reading a ramp step.
 */
export const argTypes: ArgTypes<{ radius: RadiusMode }> = {
  radius: {
    name: 'Radius',
    description: 'Manti UI radius preset',
    control: { type: 'select' },
    options: [...RADIUS_MODES],
    defaultValue: 'default',
  },
};

/** Resolve Ladle's theme (`light`, `dark` or `auto`) to a Manti theme. */
const resolveTheme = (theme: string): 'light' | 'dark' => {
  if (theme === 'dark' || theme === 'light') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Drive `[data-theme]` and `[data-radius]` on the story document's root, and
 * lay the story out: a story file picks `centered`, `padded` or `fullscreen`
 * through `meta.layout`.
 */
export const Provider: GlobalProvider = ({
  children,
  globalState,
  storyMeta,
}) => {
  const theme = resolveTheme(globalState.theme);
  const radiusValue: unknown = globalState.control.radius?.value;
  const radius = isRadiusMode(radiusValue) ? radiusValue : 'default';
  const layout = isLayout(storyMeta?.layout) ? storyMeta.layout : 'padded';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.radius = radius;
  }, [radius]);

  return (
    <div className="manti-ladle-layout" data-layout={layout}>
      {children}
    </div>
  );
};
