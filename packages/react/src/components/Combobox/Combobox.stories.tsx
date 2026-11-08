import type { Story, StoryDefault } from '@ladle/react';

import { Combobox } from './Combobox.js';
import type { ComboboxProps } from './Combobox.js';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
  { value: 'mint', label: 'Dried mint' },
  { value: 'pepper', label: 'Black pepper' },
  { value: 'chili', label: 'Chili flakes' },
  { value: 'coriander', label: 'Coriander' },
];

export default {
  title: 'Components/Combobox',
  args: {
    items: spices,
    label: 'Spice',
    placeholder: 'Search spices…',
    variant: 'default',
    size: 'md',
    multiple: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['default', 'fill'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ComboboxProps>;

export const Playground: Story<ComboboxProps> = (args) => (
  <Combobox {...args} />
);

export const Filled: Story<ComboboxProps> = (args) => <Combobox {...args} />;
Filled.args = { variant: 'fill', label: undefined };

export const Multiple: Story<ComboboxProps> = (args) => <Combobox {...args} />;
Multiple.args = {
  multiple: true,
  label: 'Spices',
  defaultValue: ['sumac', 'mint'],
};

/**
 * A catalogue far longer than the listbox can usefully render: 2,000 options,
 * of which `maxVisibleItems` (25 here, 200 by default) reach the DOM. Typing
 * filters the whole set, and the line under the rows says how many matches are
 * still hidden.
 */
export const LongCatalogue: Story<ComboboxProps> = (args) => (
  <Combobox {...args} />
);
LongCatalogue.args = {
  label: 'Entry',
  placeholder: 'Search 2,000 entries…',
  maxVisibleItems: 25,
  items: Array.from({ length: 2000 }, (_, index) => ({
    value: `entry-${index}`,
    label: `Entry ${String(index + 1).padStart(4, '0')}`,
  })),
};
