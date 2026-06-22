import { useState } from 'react';
import { Badge, Button, Card, Swipe } from '@manti-ui/react';

export default function SwipeDismiss() {
  const [cards, setCards] = useState([1, 2, 3, 4]);

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-3)',
        justifyItems: 'center',
      }}
    >
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
              width: 'calc(var(--manti-space-16) * 5)',
              height: 'calc(var(--manti-space-16) * 1.1)',
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            Card {id}
          </Card>
        </Swipe>
      ))}
      {cards.length === 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCards([1, 2, 3, 4])}
        >
          Reset
        </Button>
      )}
    </div>
  );
}
