import type { Story, StoryDefault } from '@ladle/react';

import { Kbd } from './Kbd.js';
import type { KbdProps } from './Kbd.js';

export default {
  title: 'Typography/Kbd',
  args: {
    children: '⌘ K',
    size: 'sm',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<KbdProps>;

export const Playground: Story<KbdProps> = (args) => <Kbd {...args} />;

export const Sizes: Story<KbdProps> = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--manti-space-3)',
    }}
  >
    <Kbd size="sm">Esc</Kbd>
    <Kbd size="md">Enter</Kbd>
  </div>
);

export const Shortcut: Story<KbdProps> = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--manti-space-2)',
    }}
  >
    <Kbd>⌘</Kbd>
    <span>+</span>
    <Kbd>K</Kbd>
  </span>
);
