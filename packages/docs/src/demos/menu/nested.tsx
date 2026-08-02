import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';
import { useState } from 'react';

const items: MenuItem[] = [
  { value: 'new', label: 'New file' },
  {
    type: 'submenu',
    value: 'open-recent',
    label: 'Open recent',
    items: [
      { value: 'project-alpha', label: 'Project Alpha' },
      { value: 'project-beta', label: 'Project Beta' },
    ],
  },
  { type: 'separator' },
  { value: 'settings', label: 'Settings' },
];

export default function MenuNested() {
  const [selected, setSelected] = useState('Nothing selected');

  return (
    <>
      <Menu
        trigger={<Button variant="tertiary">File</Button>}
        items={items}
        onSelect={setSelected}
      />
      <span aria-live="polite">Selected: {selected}</span>
    </>
  );
}
