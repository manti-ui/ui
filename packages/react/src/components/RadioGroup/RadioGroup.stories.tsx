import type { Story, StoryDefault } from '@ladle/react';

import { RadioGroup } from './RadioGroup.js';
import type { RadioGroupProps } from './RadioGroup.js';

export default {
  title: 'Components/RadioGroup',
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
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['vertical', 'horizontal'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<RadioGroupProps>;

export const Playground: Story<RadioGroupProps> = (args) => (
  <RadioGroup {...args} />
);

export const Horizontal: Story<RadioGroupProps> = (args) => (
  <RadioGroup {...args} />
);
Horizontal.args = { orientation: 'horizontal', label: 'Spice level' };
