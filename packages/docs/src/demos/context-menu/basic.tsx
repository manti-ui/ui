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
      <div className="context-menu-target">
        Right-click anywhere here
      </div>
    </ContextMenu>
  );
}
