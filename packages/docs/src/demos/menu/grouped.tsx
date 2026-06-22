import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';

const items: MenuItem[] = [
  {
    type: 'group',
    label: 'Toppings',
    items: [
      { value: 'yogurt', label: 'Garlic yogurt' },
      { value: 'butter', label: 'Chili butter' },
      { value: 'mint', label: 'Dried mint' },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Style',
    items: [
      { value: 'kayseri', label: 'Kayseri (tiny)' },
      { value: 'steamed', label: 'Steamed (large)' },
    ],
  },
];

export default function MenuGrouped() {
  return (
    <Menu
      trigger={<Button variant="outline">Customize…</Button>}
      items={items}
    />
  );
}
