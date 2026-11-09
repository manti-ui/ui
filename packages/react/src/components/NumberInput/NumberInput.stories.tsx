import type { Story, StoryDefault } from '@ladle/react';

import { NumberInput } from './NumberInput.js';
import type { NumberInputProps } from './NumberInput.js';

export default {
  title: 'Components/NumberInput',
  args: {
    label: 'Servings',
    size: 'md',
    variant: 'primary',
    defaultValue: '12',
    min: 0,
    max: 99,
    step: 1,
    disabled: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<NumberInputProps>;

export const Playground: Story<NumberInputProps> = (args) => (
  <NumberInput {...args} />
);

export const Sizes: Story<NumberInputProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <NumberInput {...args} size="sm" label="Small" />
    <NumberInput {...args} size="md" label="Medium" />
    <NumberInput {...args} size="lg" label="Large" />
  </div>
);

export const States: Story<NumberInputProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <NumberInput {...args} label="Default" />
    <NumberInput {...args} label="Invalid" invalid />
    <NumberInput {...args} label="Disabled" disabled />
  </div>
);
