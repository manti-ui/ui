import type { Story, StoryDefault } from '@ladle/react';

import { TimePicker } from './TimePicker.js';
import type { TimePickerProps } from './TimePicker.js';

export default {
  title: 'Components/TimePicker',
  args: {
    label: 'Pickup time',
    variant: 'primary',
    defaultValue: '12:30',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<TimePickerProps>;

export const Playground: Story<TimePickerProps> = (args) => (
  <TimePicker {...args} />
);
