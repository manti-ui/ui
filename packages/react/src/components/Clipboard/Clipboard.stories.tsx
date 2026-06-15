import type { Meta, StoryObj } from '@storybook/react-vite';

import { Clipboard } from './Clipboard';

const meta = {
  title: 'Components/Clipboard',
  component: Clipboard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: 'npm install @manti-ui/react',
    label: 'Install command',
    tone: 'success',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Clipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
