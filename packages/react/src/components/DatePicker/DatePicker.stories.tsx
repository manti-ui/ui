import type { Story, StoryDefault } from '@ladle/react';

import { DatePicker } from './DatePicker.js';
import type { DatePickerProps } from './DatePicker.js';

export default {
  title: 'Components/DatePicker',
  args: {
    label: 'Reservation date',
    variant: 'primary',
    selectionMode: 'single',
    defaultValue: ['2026-06-15'],
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    selectionMode: {
      control: { type: 'inline-radio' },
      options: ['single', 'multiple', 'range'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<DatePickerProps>;

export const Playground: Story<DatePickerProps> = (args) => (
  <DatePicker {...args} />
);

export const Range: Story<DatePickerProps> = (args) => <DatePicker {...args} />;
Range.args = {
  label: 'Stay',
  selectionMode: 'range',
  defaultValue: ['2026-06-15', '2026-06-20'],
};
