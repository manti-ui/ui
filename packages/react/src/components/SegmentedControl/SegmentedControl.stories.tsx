import type { Story, StoryDefault } from '@ladle/react';

import { SegmentedControl } from './SegmentedControl.js';
import type { SegmentedControlProps } from './SegmentedControl.js';

export default {
  title: 'Components/SegmentedControl',
  args: {
    items: [
      { value: 'boiled', label: 'Boiled' },
      { value: 'steamed', label: 'Steamed' },
      { value: 'fried', label: 'Fried' },
    ],
    defaultValue: 'boiled',
    size: 'md',
    variant: 'primary',
    orientation: 'horizontal',
    rootProps: { 'aria-label': 'Cooking method' },
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<SegmentedControlProps>;

export const Playground: Story<SegmentedControlProps> = (args) => (
  <SegmentedControl {...args} />
);

export const Sizes: Story<SegmentedControlProps> = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {(['sm', 'md', 'lg'] as const).map((size) => (
      <SegmentedControl
        key={size}
        size={size}
        defaultValue="grid"
        rootProps={{ 'aria-label': `Layout (${size})` }}
        items={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
          { value: 'board', label: 'Board' },
        ]}
      />
    ))}
  </div>
);

export const Vertical: Story<SegmentedControlProps> = (args) => (
  <SegmentedControl {...args} />
);
Vertical.args = {
  orientation: 'vertical',
  defaultValue: 'steamed',
};

export const WithDisabledSegment: Story<SegmentedControlProps> = (args) => (
  <SegmentedControl {...args} />
);
WithDisabledSegment.args = {
  defaultValue: 'boiled',
  items: [
    { value: 'boiled', label: 'Boiled' },
    { value: 'steamed', label: 'Steamed' },
    { value: 'fried', label: 'Fried', disabled: true },
  ],
};
