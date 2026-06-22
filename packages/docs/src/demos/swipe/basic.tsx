import { useState } from 'react';
import { Card, Swipe } from '@manti-ui/react';
import type { SwipeDetails } from '@manti-ui/react';

export default function SwipeBasic() {
  const [last, setLast] = useState<SwipeDetails['direction'] | null>(null);

  return (
    <Swipe axis="both" onSwipe={(d) => setLast(d.direction)}>
      <Card
        elevated
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 'calc(var(--manti-space-16) * 4)',
          height: 'calc(var(--manti-space-16) * 2.5)',
          padding: 'var(--manti-space-5)',
          textAlign: 'center',
          fontWeight: 600,
          userSelect: 'none',
        }}
      >
        Swipe me
        <br />
        <span style={{ color: 'var(--manti-text-muted)', fontWeight: 400 }}>
          {last ? `last: ${last}` : 'horizontal & vertical'}
        </span>
      </Card>
    </Swipe>
  );
}
