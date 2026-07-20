import type { Meta, StoryObj } from '@storybook/react-vite';

import { TimePicker } from './TimePicker';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Pickup time',
    variant: 'primary',
    defaultValue: '12:30',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
