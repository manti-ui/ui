import { useState } from 'react';
import { Badge, Button, Dialog, TextField } from '@manti-ui/react';
import { useShortcut } from '@manti-ui/react/shortcut';

export default function ShortcutGlobal() {
  const [open, setOpen] = useState(false);

  // Global by default: the listener sits on `window`, so the combo fires
  // regardless of focus and needs zero wiring on any element. `preventDefault`
  // is on by default, so the browser's own combo doesn't also fire.
  useShortcut('mod+i', () => setOpen(true));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--manti-space-3)',
      }}
    >
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Badge variant="outline" style={{ fontFamily: 'var(--manti-font-mono)' }}>
        mod+i
      </Badge>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Quick open"
        description="Opened by click or by the global ⌘I / Ctrl+I shortcut."
      >
        <TextField label="Search" placeholder="Type to search…" />
      </Dialog>
    </div>
  );
}
