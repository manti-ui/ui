import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from './Combobox';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
  { value: 'mint', label: 'Dried mint' },
  { value: 'pepper', label: 'Black pepper' },
  { value: 'chili', label: 'Chili flakes' },
  { value: 'coriander', label: 'Coriander' },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items: spices,
    label: 'Spice',
    placeholder: 'Search spices…',
    variant: 'default',
    size: 'md',
    multiple: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['default', 'fill'],
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Filled: Story = {
  args: { variant: 'fill', label: undefined },
};

export const Multiple: Story = {
  args: { multiple: true, label: 'Spices', defaultValue: ['sumac', 'mint'] },
};

/**
 * A catalogue far longer than the listbox can usefully render: 2,000 options,
 * of which `maxVisibleItems` (25 here, 200 by default) reach the DOM. Typing
 * filters the whole set, and the line under the rows says how many matches are
 * still hidden.
 */
export const LongCatalogue: Story = {
  args: {
    label: 'Entry',
    placeholder: 'Search 2,000 entries…',
    maxVisibleItems: 25,
    items: Array.from({ length: 2000 }, (_, index) => ({
      value: `entry-${index}`,
      label: `Entry ${String(index + 1).padStart(4, '0')}`,
    })),
  },
};
