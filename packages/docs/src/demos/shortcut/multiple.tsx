import { useState } from 'react';
import { Badge, Card } from '@manti-ui/react';
import { useShortcuts } from '@manti-ui/react/shortcut';

const COMBOS = ['mod+b', 'mod+/', 'g d'];

export default function ShortcutMultiple() {
  const [log, setLog] = useState<string[]>([]);
  const push = (message: string) =>
    setLog((prev) => [message, ...prev].slice(0, 4));

  // Bind several combos at once. `g d` is a sequence: press `g` then `d`.
  useShortcuts({
    'mod+b': () => push('mod+b → bold'),
    'mod+/': () => push('mod+/ → toggle help'),
    'g d': () => push('g d → go to dashboard'),
  });

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-3)',
        width: 'calc(var(--manti-space-16) * 4)',
      }}
    >
      <div
        style={{ display: 'flex', gap: 'var(--manti-space-2)', flexWrap: 'wrap' }}
      >
        {COMBOS.map((combo) => (
          <Badge
            key={combo}
            variant="outline"
            style={{ fontFamily: 'var(--manti-font-mono)' }}
          >
            {combo}
          </Badge>
        ))}
      </div>
      <Card
        style={{
          display: 'grid',
          gap: 'var(--manti-space-1)',
          padding: 'var(--manti-space-4)',
          minHeight: 'calc(var(--manti-space-16) * 1.5)',
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: 'var(--manti-text-muted)' }}>
            Press a shortcut…
          </span>
        ) : (
          log.map((entry, index) => (
            <span
              key={`${entry}-${index}`}
              style={{
                fontFamily: 'var(--manti-font-mono)',
                opacity: index === 0 ? 1 : 0.5,
              }}
            >
              {entry}
            </span>
          ))
        )}
      </Card>
    </div>
  );
}
