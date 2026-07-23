import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Cooking method',
    variant: 'primary',
    defaultValue: 'boiled',
    items: [
      { value: 'boiled', label: 'Boiled' },
      { value: 'steamed', label: 'Steamed' },
      { value: 'fried', label: 'Fried', disabled: true },
    ],
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', label: 'Spice level' },
};
