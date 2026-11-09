import type { Story, StoryDefault } from '@ladle/react';

import { HoverCard } from './HoverCard.js';
import type { HoverCardProps } from './HoverCard.js';

export default {
  title: 'Components/HoverCard',
  args: {
    placement: 'bottom',
    showArrow: true,
    trigger: <a href="https://en.wikipedia.org/wiki/Manti_(food)">@manti</a>,
    children: (
      <div style={{ display: 'grid', gap: 4 }}>
        <strong>Mantı</strong>
        <span style={{ color: 'var(--manti-text-muted)' }}>
          Tiny Turkish dumplings served under garlicky yogurt and chili butter.
        </span>
      </div>
    ),
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<HoverCardProps>;

export const Playground: Story<HoverCardProps> = (args) => (
  <HoverCard {...args} />
);
