import type { Meta, StoryObj } from '@storybook/react-vite';

import { Splitter } from './Splitter';

const pane = (label: string) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 200,
      color: 'var(--manti-text-muted)',
    }}
  >
    {label}
  </div>
);

const meta = {
  title: 'Components/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    orientation: 'horizontal',
    panels: [
      { id: 'a', content: pane('Sidebar') },
      { id: 'b', content: pane('Main') },
    ],
    defaultSize: [30, 70],
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ThreePanels: Story = {
  args: {
    panels: [
      { id: 'a', content: pane('Left') },
      { id: 'b', content: pane('Center') },
      { id: 'c', content: pane('Right') },
    ],
    defaultSize: [25, 50, 25],
  },
};
