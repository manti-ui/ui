import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';

const items: MenuItem[] = [
  { value: 'profile', label: 'View profile' },
  { value: 'settings', label: 'Settings' },
  { type: 'separator' },
  { value: 'sign-out', label: 'Sign out' },
];

export default function MenuBottomCenter() {
  return (
    <Menu
      placement="bottom-center"
      trigger={<Button variant="tertiary">Open bottom-center menu</Button>}
      items={items}
    />
  );
}
