import type { Story, StoryDefault } from '@ladle/react';

import { Blockquote } from './Blockquote.js';
import type { BlockquoteProps } from './Blockquote.js';

export default {
  title: 'Typography/Blockquote',
  args: {
    children:
      'The best interface is the one that makes the intended action feel inevitable.',
    size: 'md',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['md', 'lg'] },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<BlockquoteProps>;

export const Playground: Story<BlockquoteProps> = (args) => (
  <Blockquote {...args} />
);

export const Sizes: Story<BlockquoteProps> = () => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--manti-space-6)',
      maxWidth: 'calc(var(--manti-space-16) * 10)',
    }}
  >
    <Blockquote size="md">
      Components should preserve the meaning of the HTML they render.
    </Blockquote>
    <Blockquote size="lg">
      A shared token language makes every new primitive feel at home.
    </Blockquote>
  </div>
);
