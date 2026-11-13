import type { Story, StoryDefault } from '@ladle/react';

import { SignaturePad } from './SignaturePad.js';
import type { SignaturePadProps } from './SignaturePad.js';

export default {
  title: 'Components/SignaturePad',
  args: {
    label: 'Sign here',
    variant: 'primary',
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<SignaturePadProps>;

export const Playground: Story<SignaturePadProps> = (args) => (
  <SignaturePad {...args} />
);
