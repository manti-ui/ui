import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';

const items: MenuItem[] = [
  {
    type: 'group',
    label: 'Edit',
    items: [
      { value: 'undo', label: 'Undo', disabled: true },
      { value: 'copy', label: 'Copy', shortcut: '⌘C' },
      { value: 'paste', label: 'Paste', shortcut: '⌘V' },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Document',
    items: [
      { value: 'rename', label: 'Rename' },
      { value: 'delete', label: 'Delete', tone: 'danger' },
    ],
  },
];

export default function MenuGrouped() {
  return (
    <Menu trigger={<Button variant="tertiary">Actions</Button>} items={items} />
  );
}
