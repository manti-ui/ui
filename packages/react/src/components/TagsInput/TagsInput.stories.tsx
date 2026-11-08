import type { Story, StoryDefault } from '@ladle/react';

import { TagsInput } from './TagsInput.js';
import type { TagsInputProps } from './TagsInput.js';

export default {
  title: 'Components/TagsInput',
  args: {
    label: 'Fillings',
    variant: 'primary',
    defaultValue: ['lamb', 'onion', 'pepper'],
    placeholder: 'Add a filling…',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<TagsInputProps>;

export const Playground: Story<TagsInputProps> = (args) => (
  <TagsInput {...args} />
);

export const States: Story<TagsInputProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem', maxWidth: 420 }}>
    <TagsInput {...args} label="Default" />
    <TagsInput {...args} label="Invalid" invalid />
    <TagsInput {...args} label="Disabled" disabled />
  </div>
);

export const MaxThree: Story<TagsInputProps> = (args) => (
  <TagsInput {...args} />
);
MaxThree.args = {
  label: 'Up to 3 tags',
  max: 3,
  defaultValue: ['lamb', 'onion'],
};
