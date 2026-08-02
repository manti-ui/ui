import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd } from './Kbd';

const meta = {
  title: 'Typography/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: '⌘ K',
    size: 'sm',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Kbd>;

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
      <Kbd size="sm">Esc</Kbd>
      <Kbd size="md">Enter</Kbd>
    </div>
  ),
};

export const Shortcut: Story = {
  render: () => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--manti-space-2)',
      }}
    >
      <Kbd>⌘</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </span>
  ),
};
