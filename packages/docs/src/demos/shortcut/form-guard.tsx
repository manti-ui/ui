import { useState } from 'react';
import { Badge, TextField } from '@manti-ui/react';
import { useShortcut } from '@manti-ui/react/shortcut';

export default function ShortcutFormGuard() {
  const [count, setCount] = useState(0);

  // By default a combo won't fire while you type in an input/textarea. Set
  // `enableOnFormElements` to opt in — here ⌘Enter submits from inside the field.
  useShortcut('mod+enter', () => setCount((n) => n + 1), {
    enableOnFormElements: true,
  });

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-3)',
        width: 'calc(var(--manti-space-16) * 4)',
      }}
    >
      <TextField
        label="Comment"
        placeholder="Type, then press ⌘/Ctrl+Enter to submit"
      />
      <Badge tone={count > 0 ? 'success' : 'neutral'}>Submitted ×{count}</Badge>
    </div>
  );
}
