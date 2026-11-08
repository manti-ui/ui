import type { Story, StoryDefault } from '@ladle/react';

import { RatingGroup } from './RatingGroup.js';
import type { RatingGroupProps } from './RatingGroup.js';

export default {
  title: 'Components/RatingGroup',
  args: {
    label: 'Rate this recipe',
    count: 5,
    variant: 'primary',
    size: 'md',
    allowHalf: false,
    defaultValue: 3,
    readOnly: false,
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
} satisfies StoryDefault<RatingGroupProps>;

export const Playground: Story<RatingGroupProps> = (args) => (
  <RatingGroup {...args} />
);

export const HalfStars: Story<RatingGroupProps> = (args) => (
  <RatingGroup {...args} />
);
HalfStars.args = { allowHalf: true, defaultValue: 3.5 };

export const ReadOnly: Story<RatingGroupProps> = (args) => (
  <RatingGroup {...args} />
);
ReadOnly.args = { readOnly: true, defaultValue: 4 };
