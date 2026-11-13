import type { Story, StoryDefault } from '@ladle/react';

import { Select } from './Select.js';
import type { SelectProps } from './Select.js';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
  { value: 'sarajevo', label: 'Sarajevo' },
];

export default {
  title: 'Components/Select',
  args: {
    items: regions,
    label: 'Region',
    placeholder: 'Pick a region…',
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
} satisfies StoryDefault<SelectProps>;

export const Playground: Story<SelectProps> = (args) => <Select {...args} />;

export const Filled: Story<SelectProps> = (args) => <Select {...args} />;
Filled.args = { variant: 'fill', label: undefined, 'aria-label': 'Region' };

export const Multiple: Story<SelectProps> = (args) => <Select {...args} />;
Multiple.args = {
  multiple: true,
  label: 'Regions',
  defaultValue: ['kayseri', 'kashgar'],
};

export const States: Story<SelectProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem', width: 460 }}>
    <Select {...args} label="Default" />
    <Select {...args} label="Invalid" invalid />
    <Select {...args} label="Disabled" disabled />
  </div>
);
