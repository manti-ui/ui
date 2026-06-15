import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    src: 'https://i.pravatar.cc/120?img=12',
    alt: 'A person',
    children: 'MU',
    size: 'md',
    shape: 'circle',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Fallback: Story = {
  args: { src: undefined, children: 'MU' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
};
