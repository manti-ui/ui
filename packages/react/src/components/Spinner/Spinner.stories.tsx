import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const OnTone: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '1.5rem',
        borderRadius: '14px',
        color: 'var(--manti-orange-500)',
      }}
    >
      <Spinner />
      <span style={{ color: 'var(--manti-green-500)' }}>
        <Spinner />
      </span>
      <span style={{ color: 'var(--manti-blue-500)' }}>
        <Spinner />
      </span>
    </div>
  ),
};
