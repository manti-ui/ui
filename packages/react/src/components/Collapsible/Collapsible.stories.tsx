import type { Meta, StoryObj } from '@storybook/react-vite';

import { Collapsible } from './Collapsible';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    trigger: "Show chef's note",
    children: (
      <Text
        emphasis="muted"
        style={{ padding: 'var(--manti-space-3) var(--manti-space-1) 0' }}
      >
        Rest the dough for 30 minutes so it rolls out smooth and thin.
      </Text>
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
