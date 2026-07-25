import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';

import '@manti-ui/styles/index.css';
import './preview.css';

const RADIUS_MODES = ['none', 'sharp', 'default', 'round', 'pill'] as const;

/** Drive the Manti UI theme from a Storybook toolbar toggle. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <Story />;
};

/**
 * Drive `[data-radius]` from a toolbar toggle — the fastest way to check that a
 * component anchors on the right ramp step and joined (or stayed out of) the
 * pill channel. `pill` is the revealing one: controls should turn into
 * lozenges while the checkbox keeps a square silhouette.
 */
const withRadius: Decorator = (Story, context) => {
  const radius = RADIUS_MODES.includes(context.globals.radius)
    ? context.globals.radius
    : 'default';

  useEffect(() => {
    document.documentElement.dataset.radius = radius;
  }, [radius]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme, withRadius],
  globalTypes: {
    theme: {
      description: 'Manti UI theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    radius: {
      description: 'Manti UI radius preset',
      defaultValue: 'default',
      toolbar: {
        title: 'Radius',
        icon: 'cog',
        items: RADIUS_MODES.map((value) => ({
          value,
          title: value[0].toUpperCase() + value.slice(1),
        })),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    a11y: {
      context: 'body',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Getting Started', 'Foundations', 'Components', '*'],
      },
    },
  },
};

export default preview;
