import type { Story, StoryDefault } from '@ladle/react';

import { Tabs } from './Tabs.js';
import type { TabsProps } from './Tabs.js';

const items = [
  {
    value: 'dough',
    label: 'Dough',
    content: 'Flour, egg, water, and a pinch of salt.',
  },
  {
    value: 'filling',
    label: 'Filling',
    content: 'Beef or lamb, grated onion, and spice.',
  },
  {
    value: 'sauce',
    label: 'Sauce',
    content: 'Garlic yogurt under warm paprika butter.',
  },
];

export default {
  title: 'Components/Tabs',
  args: { items },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['line', 'pill', 'soft'],
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  meta: { layout: 'padded' },
} satisfies StoryDefault<TabsProps>;

export const Playground: Story<TabsProps> = (args) => <Tabs {...args} />;

/** Translucent segmented control: a translucent track with a sliding translucent thumb. */
export const Pill: Story<TabsProps> = (args) => <Tabs {...args} />;
Pill.args = { variant: 'pill' };

/** A translucent pill on the active tab, with no enclosing track. */
export const Soft: Story<TabsProps> = (args) => <Tabs {...args} />;
Soft.args = { variant: 'soft' };

export const Vertical: Story<TabsProps> = (args) => <Tabs {...args} />;
Vertical.args = { orientation: 'vertical' };

/** Compact triggers for embedded, secondary UI. */
export const Small: Story<TabsProps> = (args) => <Tabs {...args} />;
Small.args = { size: 'sm', variant: 'soft' };
