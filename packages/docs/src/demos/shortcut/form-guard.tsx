import { useState } from 'react';
import { Badge, Input } from '@manti-ui/react';
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
      <Input
        label="Comment"
        placeholder="Type, then press ⌘/Ctrl+Enter to submit"
      />
      <Badge variant={count > 0 ? 'primary' : 'secondary'}>Submitted ×{count}</Badge>
    </div>
  );
}
