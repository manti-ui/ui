import type { Story, StoryDefault } from '@ladle/react';

import { Editable } from './Editable.js';
import type { EditableProps } from './Editable.js';

export default {
  title: 'Components/Editable',
  args: {
    label: 'Recipe name',
    variant: 'primary',
    defaultValue: 'Kayseri mantısı',
    placeholder: 'Enter a name…',
    activationMode: 'focus',
    submitMode: 'both',
    disabled: false,
  },
  argTypes: {
    activationMode: {
      control: { type: 'inline-radio' },
      options: ['focus', 'dblclick', 'click', 'none'],
    },
    submitMode: {
      control: { type: 'inline-radio' },
      options: ['enter', 'blur', 'both', 'none'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<EditableProps>;

export const Playground: Story<EditableProps> = (args) => (
  <Editable {...args} />
);

export const DoubleClickToEdit: Story<EditableProps> = (args) => (
  <Editable {...args} />
);
DoubleClickToEdit.args = { activationMode: 'dblclick' };

export const Empty: Story<EditableProps> = (args) => <Editable {...args} />;
Empty.args = { defaultValue: '', placeholder: 'Click to add a name…' };
