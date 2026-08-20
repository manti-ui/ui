import { Button, Menu } from '@manti-ui/react';
import type { MenuItem } from '@manti-ui/react';

const items: MenuItem[] = [
  { value: 'new', label: 'New file' },
  { value: 'open', label: 'Open…' },
  { value: 'save', label: 'Save', shortcut: '⌘S' },
];

export default function MenuSizes() {
  return (
    <div className="menu-options">
      <Menu
        size="sm"
        trigger={
          <Button variant="tertiary" size="sm">
            Small
          </Button>
        }
        items={items}
      />
      <Menu
        size="md"
        trigger={<Button variant="tertiary">Medium</Button>}
        items={items}
      />
      <Menu
        size="lg"
        trigger={
          <Button variant="tertiary" size="lg">
            Large
          </Button>
        }
        items={items}
      />
    </div>
  );
}
