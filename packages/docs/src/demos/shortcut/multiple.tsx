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
    <div className="shortcut-grid">
      <div className="shortcut-list">
        {COMBOS.map((combo) => (
          <Badge key={combo} variant="outline" className="shortcut-key">
            {combo}
          </Badge>
        ))}
      </div>
      <Card className="shortcut-log">
        {log.length === 0 ? (
          <span className="shortcut-empty">Press a shortcut…</span>
        ) : (
          log.map((entry, index) => (
            <span
              key={`${entry}-${index}`}
              className={
                index === 0 ? 'shortcut-entry' : 'shortcut-entry-muted'
              }
            >
              {entry}
            </span>
          ))
        )}
      </Card>
    </div>
  );
}
