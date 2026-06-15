import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    variant: 'linear',
    label: 'Steaming',
    tone: 'primary',
    size: 'md',
    defaultValue: 65,
    showValue: true,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['linear', 'circular'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Circular: Story = {
  args: { variant: 'circular' },
};

export const Indeterminate: Story = {
  args: { defaultValue: null, showValue: false },
};
