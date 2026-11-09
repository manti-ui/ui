import type { Story, StoryDefault } from '@ladle/react';

import { Clipboard } from './Clipboard.js';
import type { ClipboardProps } from './Clipboard.js';

export default {
  title: 'Components/Clipboard',
  args: {
    value: 'npm install @manti-ui/react',
    label: 'Install command',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ClipboardProps>;

export const Playground: Story<ClipboardProps> = (args) => (
  <Clipboard {...args} />
);
