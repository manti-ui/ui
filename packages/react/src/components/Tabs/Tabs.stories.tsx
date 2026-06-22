import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs } from './Tabs';

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

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { items, tone: 'primary' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['line', 'pill', 'soft'],
    },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    orientation: {
      control: 'inline-radio',
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
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Translucent segmented control: a translucent track with a sliding translucent thumb. */
export const Pill: Story = {
  args: { variant: 'pill' },
};

/** A translucent pill on the active tab, with no enclosing track. */
export const Soft: Story = {
  args: { variant: 'soft' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};
