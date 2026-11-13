import type { Story, StoryDefault } from '@ladle/react';

import { Listbox } from './Listbox.js';
import type { ListboxProps } from './Listbox.js';

const fillings = [
  { value: 'lamb', label: 'Lamb & onion' },
  { value: 'beef', label: 'Beef & herb' },
  { value: 'pumpkin', label: 'Pumpkin' },
  { value: 'potato', label: 'Potato', disabled: true },
  { value: 'spinach', label: 'Spinach & cheese' },
];

export default {
  title: 'Components/Listbox',
  args: {
    items: fillings,
    label: 'Filling',
    variant: 'primary',
    selectionMode: 'single',
    defaultValue: ['beef'],
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    selectionMode: {
      control: { type: 'inline-radio' },
      options: ['single', 'multiple'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ListboxProps>;

export const Playground: Story<ListboxProps> = (args) => <Listbox {...args} />;

export const Multiple: Story<ListboxProps> = (args) => <Listbox {...args} />;
Multiple.args = {
  selectionMode: 'multiple',
  defaultValue: ['lamb', 'pumpkin'],
};
