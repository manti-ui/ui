import type { Story, StoryDefault } from '@ladle/react';

import { Progress } from './Progress.js';
import type { ProgressProps } from './Progress.js';

export default {
  title: 'Components/Progress',
  args: {
    variant: 'linear',
    label: 'Steaming',
    size: 'md',
    defaultValue: 65,
    showValue: true,
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['linear', 'circular'],
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<ProgressProps>;

export const Playground: Story<ProgressProps> = (args) => (
  <Progress {...args} />
);

export const Circular: Story<ProgressProps> = (args) => <Progress {...args} />;
Circular.args = { variant: 'circular' };

export const Indeterminate: Story<ProgressProps> = (args) => (
  <Progress {...args} />
);
Indeterminate.args = { defaultValue: null, showValue: false };
