import type { Story, StoryDefault } from '@ladle/react';

import { PinInput } from './PinInput.js';
import type { PinInputProps } from './PinInput.js';

export default {
  title: 'Components/PinInput',
  args: {
    label: 'One-time code',
    length: 4,
    size: 'md',
    variant: 'primary',
    type: 'numeric',
    otp: true,
    mask: false,
    disabled: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    type: {
      control: { type: 'inline-radio' },
      options: ['numeric', 'alphanumeric', 'alphabetic'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<PinInputProps>;

export const Playground: Story<PinInputProps> = (args) => (
  <PinInput {...args} />
);

export const SixDigits: Story<PinInputProps> = (args) => <PinInput {...args} />;
SixDigits.args = { length: 6, label: 'Verification code' };

export const Masked: Story<PinInputProps> = (args) => <PinInput {...args} />;
Masked.args = { mask: true, label: 'PIN' };

export const States: Story<PinInputProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <PinInput {...args} label="Default" />
    <PinInput {...args} label="Invalid" invalid />
    <PinInput {...args} label="Disabled" disabled />
  </div>
);
