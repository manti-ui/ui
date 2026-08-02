import type { Meta, StoryObj } from '@storybook/react-vite';

import { Code } from './Code';

const meta = {
  title: 'Typography/Code',
  component: Code,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: 'pnpm add @manti-ui/react',
    size: 'sm',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--manti-space-3)',
      }}
    >
      <Code size="sm">const manti = true</Code>
      <Code size="md">const manti = true</Code>
    </div>
  ),
};
