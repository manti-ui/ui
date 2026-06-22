import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';

const items: MenuItem[] = [
  { value: 'yogurt', label: 'Garlic yogurt', shortcut: '⌘1' },
  { value: 'butter', label: 'Chili butter', shortcut: '⌘2' },
  { value: 'broth', label: 'In broth', shortcut: '⌘3' },
  { type: 'separator' },
  { value: 'plain', label: 'Plain', disabled: true },
];

export default function MenuBasic() {
  return (
    <Menu
      trigger={<Button variant="outline">Serve as…</Button>}
      items={items}
    />
  );
}
