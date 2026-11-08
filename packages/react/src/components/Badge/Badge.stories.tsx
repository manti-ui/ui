import type { CSSProperties } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Badge } from './Badge.js';
import type { BadgeProps } from './Badge.js';

const variants = ['primary', 'secondary', 'danger', 'outline'] as const;

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  alignItems: 'center',
};

export default {
  title: 'Components/Badge',
  args: {
    children: 'Fresh',
    variant: 'secondary',
    size: 'sm',
    dot: false,
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: variants },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<BadgeProps>;

export const Playground: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Variants: Story<BadgeProps> = (args) => (
  <div style={row}>
    {variants.map((variant) => (
      <Badge {...args} key={variant} variant={variant}>
        {variant}
      </Badge>
    ))}
  </div>
);

export const WithDot: Story<BadgeProps> = (args) => (
  <div style={row}>
    <Badge {...args} variant="primary" dot>
      Ready
    </Badge>
    <Badge {...args} variant="outline" dot>
      Resting
    </Badge>
    <Badge {...args} variant="danger" dot>
      Burnt
    </Badge>
  </div>
);
