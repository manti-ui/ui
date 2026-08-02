import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';
import { useState } from 'react';

export default function MenuOptions() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const items: MenuItem[] = [
    {
      type: 'group',
      label: 'View',
      items: [
        {
          type: 'checkbox',
          value: 'sidebar',
          label: 'Show sidebar',
          checked: showSidebar,
          closeOnSelect: false,
          onCheckedChange: setShowSidebar,
        },
      ],
    },
    { type: 'separator' },
    {
      type: 'group',
      label: 'Sort by',
      items: [
        {
          type: 'radio',
          value: 'name',
          label: 'Name',
          checked: sortBy === 'name',
          onCheckedChange: (checked) => checked && setSortBy('name'),
        },
        {
          type: 'radio',
          value: 'date',
          label: 'Date modified',
          checked: sortBy === 'date',
          onCheckedChange: (checked) => checked && setSortBy('date'),
        },
      ],
    },
  ];

  return (
    <Menu
      trigger={<Button variant="tertiary">View options</Button>}
      items={items}
    />
  );
}
