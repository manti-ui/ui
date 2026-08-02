import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';
import { useState } from 'react';

const items: MenuItem[] = [
  { value: 'new', label: 'New file' },
  { value: 'open', label: 'Open…' },
  { value: 'save', label: 'Save', shortcut: '⌘S' },
];

export default function MenuBasic() {
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
