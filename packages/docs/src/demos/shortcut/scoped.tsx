import { useRef, useState } from 'react';
import { Badge, Card } from '@manti-ui/react';
import { useShortcut } from '@manti-ui/react/shortcut';

export default function ShortcutScoped() {
  const ref = useRef<HTMLDivElement>(null);
  const [saves, setSaves] = useState(0);

  // Scoped: pass a ref and the combo only fires while focus is inside it. ⌘S
  // outside the region falls through to the browser; `preventDefault` stops the
  // native "save page" dialog when it does fire here.
  useShortcut('mod+s', () => setSaves((n) => n + 1), { scope: ref });

  return (
    <div ref={ref} tabIndex={-1} style={{ outline: 'none' }}>
      <Card
        elevated
        style={{
          display: 'grid',
          gap: 'var(--manti-space-3)',
          padding: 'var(--manti-space-5)',
          width: 'calc(var(--manti-space-16) * 4)',
        }}
      >
        <strong>Editor region</strong>
        <span style={{ color: 'var(--manti-text-muted)' }}>
          Click to focus, then press ⌘S / Ctrl+S to save.
        </span>
        <Badge tone={saves > 0 ? 'success' : 'neutral'}>
          {saves > 0 ? `Saved ×${saves}` : 'Not saved'}
        </Badge>
      </Card>
    </div>
  );
}
