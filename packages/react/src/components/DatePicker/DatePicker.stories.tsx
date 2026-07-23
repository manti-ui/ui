import type { Meta, StoryObj } from '@storybook/react-vite';

import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Reservation date',
    variant: 'primary',
    selectionMode: 'single',
    defaultValue: ['2026-06-15'],
  },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['single', 'multiple', 'range'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  args: {
    label: 'Stay',
    selectionMode: 'range',
    defaultValue: ['2026-06-15', '2026-06-20'],
  },
};
