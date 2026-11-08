import type { Story, StoryDefault } from '@ladle/react';

import { Textarea } from './Textarea.js';
import type { TextareaProps } from './Textarea.js';

export default {
  title: 'Components/Textarea',
  args: {
    label: 'Notes',
    placeholder: 'Add preparation notes',
    size: 'md',
    variant: 'default',
    rows: 4,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['default', 'fill'],
    },
    resize: {
      control: { type: 'inline-radio' },
      options: ['none', 'vertical'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'calc(var(--manti-space-16) * 6)' }}>
        <Story />
      </div>
    ),
  ],
  meta: { layout: 'centered' },
} satisfies StoryDefault<TextareaProps>;

export const Playground: Story<TextareaProps> = (args) => (
  <Textarea {...args} />
);

export const Filled: Story<TextareaProps> = (args) => <Textarea {...args} />;
Filled.args = {
  variant: 'fill',
  label: undefined,
  placeholder: 'Message',
  resize: 'none',
};

export const WithDescription: Story<TextareaProps> = (args) => (
  <Textarea {...args} />
);
WithDescription.args = {
  description: 'Shown below the field while there is no error.',
};

export const Invalid: Story<TextareaProps> = (args) => <Textarea {...args} />;
Invalid.args = {
  defaultValue: 'Too short',
  error: 'Please add at least three sentences.',
};

export const AutoResize: Story<TextareaProps> = (args) => (
  <Textarea {...args} />
);
AutoResize.args = {
  autoResize: true,
  maxHeight: 'calc(var(--manti-space-16) * 2)',
  defaultValue:
    'This textarea grows with content until it reaches its maximum height.',
};

export const ResizeNone: Story<TextareaProps> = (args) => (
  <Textarea {...args} />
);
ResizeNone.args = {
  resize: 'none',
  defaultValue: 'Manual resizing is disabled for this field.',
};

export const Sizes: Story<TextareaProps> = (args) => (
  <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
    <Textarea {...args} size="sm" label="Small" />
    <Textarea {...args} size="md" label="Medium" />
    <Textarea {...args} size="lg" label="Large" />
  </div>
);

export const Disabled: Story<TextareaProps> = (args) => <Textarea {...args} />;
Disabled.args = { defaultValue: 'Locked notes', disabled: true };
