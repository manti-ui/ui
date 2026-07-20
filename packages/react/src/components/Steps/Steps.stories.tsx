import type { Meta, StoryObj } from '@storybook/react-vite';

import { Steps } from './Steps';

const items = [
  { title: 'Dough', description: 'Knead & rest', content: 'Make the dough.' },
  { title: 'Fill', description: 'Spoon & fold', content: 'Fill the wrappers.' },
  { title: 'Steam', description: 'Cook through', content: 'Steam until done.' },
];

const meta = {
  title: 'Components/Steps',
  component: Steps,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    items,
    variant: 'primary',
    orientation: 'horizontal',
    defaultStep: 0,
    controls: true,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};
