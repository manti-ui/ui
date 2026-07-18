import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Swipe } from './Swipe';
import type { SwipeDetails } from './Swipe';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

const meta = {
  title: 'Components/Swipe',
  component: Swipe,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    axis: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical', 'both'],
    },
  },
} satisfies Meta<typeof Swipe>;

export default meta;
type Story = StoryObj<typeof meta>;

// A centered demo surface built on the Manti Card.
const box: CSSProperties = {
  alignItems: 'center',
  justifyContent: 'center',
  width: 260,
  height: 160,
  padding: 'var(--manti-space-5)',
  textAlign: 'center',
  fontWeight: 600,
  userSelect: 'none',
};

/** Drag the card on either axis; it reports the direction and springs back. */
export const Playground: Story = {
  render: (args) => {
    const [last, setLast] = useState<SwipeDetails['direction'] | null>(null);
    return (
      <Swipe {...args} onSwipe={(d) => setLast(d.direction)}>
        <Card elevated style={box}>
          Swipe me
          <br />
          <span style={{ color: 'var(--manti-text-muted)', fontWeight: 400 }}>
            {last ? `last: ${last}` : 'horizontal & vertical'}
          </span>
        </Card>
      </Swipe>
    );
  },
  args: { axis: 'both' },
};

/** Axis-locked: the browser keeps scrolling the free axis. */
export const Axes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Swipe axis="horizontal">
        <Card elevated style={box}>
          Horizontal only
        </Card>
      </Swipe>
      <Swipe axis="vertical">
        <Card elevated style={box}>
          Vertical only
        </Card>
      </Swipe>
    </div>
  ),
};

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ICONS = {
  check: icon('M4 9.5 7.5 13 14 5'),
  bell: icon('M9 3a4 4 0 0 0-4 4c0 3-1.5 4.5-2 5h12c-.5-.5-2-2-2-5a4 4 0 0 0-4-4ZM7.5 15a1.5 1.5 0 0 0 3 0'),
  alert: icon('M9 6v4M9 12.5v.5M9 2 1.5 15.5h15L9 2Z'),
};

type Notification = {
  id: number;
  tone: 'success' | 'info' | 'warning';
  glyph: keyof typeof ICONS;
  title: string;
  message: string;
  time: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    tone: 'success',
    glyph: 'check',
    title: 'Order shipped',
    message: 'Your tray of frozen mantı is on its way.',
    time: '2m',
  },
  {
    id: 2,
    tone: 'info',
    glyph: 'bell',
    title: 'New comment',
    message: 'Aylin replied to your yogurt-garlic recipe.',
    time: '10m',
  },
  {
    id: 3,
    tone: 'warning',
    glyph: 'alert',
    title: 'Low on dough',
    message: 'Only 2 bags left — restock before the weekend.',
    time: '1h',
  },
];

const notificationCard: CSSProperties = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--manti-space-3)',
  width: 360,
  padding: 'var(--manti-space-3) var(--manti-space-4)',
  userSelect: 'none',
};

const leading: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: 'var(--manti-radius-md)',
  background: 'var(--tone-soft-bg)',
  color: 'var(--tone-solid)',
};

/**
 * A realistic swipe-to-dismiss notification stack — swipe any card sideways to
 * clear it. The component handles the gesture; the story only removes the item.
 */
export const Notifications: Story = {
  render: () => {
    const [items, setItems] = useState(NOTIFICATIONS);
    const dismiss = (id: number) =>
      setItems((prev) => prev.filter((n) => n.id !== id));

    return (
      <div
        style={{
          display: 'grid',
          gap: 10,
          justifyItems: 'stretch',
          width: 360,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <strong style={{ color: 'var(--manti-text)' }}>Notifications</strong>
          <span style={{ color: 'var(--manti-text-subtle)', fontSize: 12 }}>
            swipe to dismiss →
          </span>
        </div>

        {items.map((n) => (
          <Swipe key={n.id} axis="horizontal" onSwipe={() => dismiss(n.id)}>
            <Card style={notificationCard}>
              <span data-tone={n.tone} style={leading}>
                {ICONS[n.glyph]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: 'var(--manti-text)',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {n.title}
                </div>
                <div style={{ color: 'var(--manti-text-muted)', fontSize: 13 }}>
                  {n.message}
                </div>
              </div>
              <span style={{ color: 'var(--manti-text-subtle)', fontSize: 12 }}>
                {n.time}
              </span>
            </Card>
          </Swipe>
        ))}

        {items.length === 0 && (
          <div
            style={{
              display: 'grid',
              gap: 12,
              justifyItems: 'center',
              padding: 'var(--manti-space-6)',
              color: 'var(--manti-text-muted)',
            }}
          >
            All caught up 🎉
            <Button
              variant="soft"
              tone="neutral"
              size="sm"
              onClick={() => setItems(NOTIFICATIONS)}
            >
              Restore
            </Button>
          </div>
        )}
      </div>
    );
  },
};

/** Swipe-to-dismiss built on top of the primitive: drop cards on `onSwipe`. */
export const SwipeToDismiss: Story = {
  render: () => {
    const [cards, setCards] = useState([1, 2, 3, 4]);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <Badge tone="neutral">{cards.length} cards — swipe to dismiss</Badge>
        {cards.map((id) => (
          <Swipe
            key={id}
            axis="horizontal"
            onSwipe={() => setCards((prev) => prev.filter((c) => c !== id))}
          >
            <Card
              elevated
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 320,
                height: 72,
                fontWeight: 600,
                userSelect: 'none',
              }}
            >
              Card {id}
            </Card>
          </Swipe>
        ))}
        {cards.length === 0 && (
          <Button variant="ghost" size="sm" onClick={() => setCards([1, 2, 3, 4])}>
            Reset
          </Button>
        )}
      </div>
    );
  },
};
