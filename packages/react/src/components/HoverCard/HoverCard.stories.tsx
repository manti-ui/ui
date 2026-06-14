import type { Meta, StoryObj } from '@storybook/react-vite';

import { HoverCard } from './HoverCard';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    placement: 'bottom',
    showArrow: true,
    trigger: (
      <a href="https://en.wikipedia.org/wiki/Manti_(food)">@manti</a>
    ),
    children: (
      <div style={{ display: 'grid', gap: 4 }}>
        <strong>Mantı</strong>
        <span style={{ color: 'var(--manti-text-muted)' }}>
          Tiny Turkish dumplings served under garlicky yogurt and chili butter.
        </span>
      </div>
    ),
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
