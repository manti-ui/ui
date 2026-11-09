import type { Story, StoryDefault } from '@ladle/react';

import { Marquee } from './Marquee.js';
import type { MarqueeProps } from './Marquee.js';
import { Badge } from '../Badge/Badge.js';

const tags = [
  'Framework-agnostic',
  'Zag.js machines',
  'Design tokens',
  'light-dark()',
  'Monochrome',
  'Accessible',
];

const Tags = () => (
  <>
    {tags.map((t) => (
      <Badge key={t} variant="secondary">
        {t}
      </Badge>
    ))}
  </>
);

export default {
  title: 'Components/Marquee',
  args: {
    children: <Tags />,
    direction: 'left',
    speed: 20,
    pauseOnHover: true,
    gap: 'md',
  },
  argTypes: {
    direction: {
      control: { type: 'inline-radio' },
      options: ['left', 'right', 'up', 'down'],
    },
    speed: { control: { type: 'number', min: 2, max: 60 } },
    gap: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<MarqueeProps>;

export const Playground: Story<MarqueeProps> = (args) => <Marquee {...args} />;

export const Directions: Story<MarqueeProps> = () => (
  <div style={{ display: 'grid', gap: '1.5rem' }}>
    <Marquee direction="left">
      <Tags />
    </Marquee>
    <Marquee direction="right">
      <Tags />
    </Marquee>
  </div>
);
Directions.args = {
  direction: 'left',
  gap: 'md',
};

export const Text: Story<MarqueeProps> = () => (
  <Marquee speed={28}>
    <span style={{ color: 'var(--manti-text-muted)' }}>
      Manti UI — a framework-agnostic design system built on Zag.js behavior
      machines.
    </span>
  </Marquee>
);

export const Vertical: Story<MarqueeProps> = () => (
  <div style={{ height: '12rem' }}>
    <Marquee direction="up" speed={12}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {tags.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
    </Marquee>
  </div>
);
