import { ContextMenu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';

const items: MenuItem[] = [
  { value: 'back', label: 'Back', shortcut: '⌘[' },
  { value: 'forward', label: 'Forward', shortcut: '⌘]', disabled: true },
  { value: 'reload', label: 'Reload', shortcut: '⌘R' },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Edit',
    items: [
      { value: 'cut', label: 'Cut', shortcut: '⌘X' },
      { value: 'copy', label: 'Copy', shortcut: '⌘C' },
      { value: 'paste', label: 'Paste', shortcut: '⌘V' },
    ],
  },
];

export default function ContextMenuBasic() {
  return (
    <ContextMenu items={items}>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 'calc(var(--manti-space-16) * 5)',
          height: 'calc(var(--manti-space-16) * 2.75)',
          borderRadius: 'var(--manti-radius-lg)',
          border: '1px dashed var(--manti-border-strong)',
          color: 'var(--manti-text-muted)',
          fontSize: 'var(--manti-text-sm)',
          userSelect: 'none',
        }}
      >
        Right-click anywhere here
      </div>
    </ContextMenu>
  );
}
