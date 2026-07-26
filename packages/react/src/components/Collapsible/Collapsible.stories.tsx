import type { Meta, StoryObj } from '@storybook/react-vite';

import { Collapsible } from './Collapsible';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    trigger: "Show chef's note",
    children: (
      <p style={{ padding: '12px 4px 0', color: 'var(--manti-text-muted)' }}>
        Rest the dough for 30 minutes so it rolls out smooth and thin.
      </p>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
};

export const WithoutIndicator: Story = {
  args: { indicator: false },
};
