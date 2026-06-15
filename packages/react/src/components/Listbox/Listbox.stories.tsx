import type { Meta, StoryObj } from '@storybook/react-vite';

import { Listbox } from './Listbox';

const fillings = [
  { value: 'lamb', label: 'Lamb & onion' },
  { value: 'beef', label: 'Beef & herb' },
  { value: 'pumpkin', label: 'Pumpkin' },
  { value: 'potato', label: 'Potato', disabled: true },
  { value: 'spinach', label: 'Spinach & cheese' },
];

const meta = {
  title: 'Components/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items: fillings,
    label: 'Filling',
    tone: 'primary',
    selectionMode: 'single',
    defaultValue: ['beef'],
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  args: { selectionMode: 'multiple', defaultValue: ['lamb', 'pumpkin'] },
};
