import type { Story, StoryDefault } from '@ladle/react';

import { Code } from './Code.js';
import type { CodeProps } from './Code.js';

export default {
  title: 'Typography/Code',
  args: {
    children: 'pnpm add @manti-ui/react',
    size: 'sm',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<CodeProps>;

export const Playground: Story<CodeProps> = (args) => <Code {...args} />;

export const Sizes: Story<CodeProps> = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--manti-space-3)',
    }}
  >
    <Code size="sm">const manti = true</Code>
    <Code size="md">const manti = true</Code>
  </div>
);
