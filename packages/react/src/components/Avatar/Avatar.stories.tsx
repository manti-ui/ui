import type { Story, StoryDefault } from '@ladle/react';

import { Avatar } from './Avatar.js';
import type { AvatarProps } from './Avatar.js';

export default {
  title: 'Components/Avatar',
  args: {
    src: 'https://avatars.githubusercontent.com/u/72797914?v=4',
    alt: 'A person',
    children: 'MU',
    size: 'md',
    shape: 'circle',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    shape: { control: { type: 'inline-radio' }, options: ['circle', 'square'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<AvatarProps>;

export const Playground: Story<AvatarProps> = (args) => <Avatar {...args} />;

export const Fallback: Story<AvatarProps> = (args) => <Avatar {...args} />;
Fallback.args = { src: undefined, children: 'MU' };

export const Sizes: Story<AvatarProps> = (args) => (
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <Avatar {...args} size="sm" />
    <Avatar {...args} size="md" />
    <Avatar {...args} size="lg" />
    <Avatar {...args} size="xl" />
  </div>
);
