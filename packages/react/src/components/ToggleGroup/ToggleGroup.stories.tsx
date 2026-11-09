import type { Story, StoryDefault } from '@ladle/react';

import { ToggleGroup } from './ToggleGroup.js';
import type { ToggleGroupProps } from './ToggleGroup.js';

const alignItems = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export default {
  title: 'Components/ToggleGroup',
  args: {
    items: alignItems,
    size: 'md',
    variant: 'primary',
    multiple: false,
    defaultValue: ['center'],
    orientation: 'horizontal',
    disabled: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ToggleGroupProps>;

export const Playground: Story<ToggleGroupProps> = (args) => (
  <ToggleGroup {...args} />
);

export const Multiple: Story<ToggleGroupProps> = (args) => (
  <ToggleGroup {...args} />
);
Multiple.args = {
  multiple: true,
  defaultValue: ['left', 'right'],
  items: [
    { value: 'bold', label: 'B' },
    { value: 'italic', label: 'I' },
    { value: 'underline', label: 'U' },
  ],
};

export const ScalarSingle: Story<ToggleGroupProps> = (args) => (
  <ToggleGroup {...args} />
);
ScalarSingle.args = {
  type: 'single',
  multiple: false,
  defaultValue: 'center',
  rootProps: { 'aria-label': 'Text alignment' },
};

export const Sizes: Story<ToggleGroupProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
    <ToggleGroup {...args} size="sm" />
    <ToggleGroup {...args} size="md" />
    <ToggleGroup {...args} size="lg" />
  </div>
);
