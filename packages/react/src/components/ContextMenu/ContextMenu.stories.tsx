import type { Story, StoryDefault } from '@ladle/react';

import { ContextMenu } from './ContextMenu.js';
import type { ContextMenuProps } from './ContextMenu.js';
import type { MenuItem } from '../Menu/Menu.js';

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

const Region = () => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      width: '20rem',
      height: '11rem',
      borderRadius: 'var(--manti-radius-lg)',
      border: '1px dashed var(--manti-border-strong)',
      color: 'var(--manti-text-muted)',
      fontSize: 'var(--manti-text-sm)',
      userSelect: 'none',
    }}
  >
    Right-click anywhere here
  </div>
);

export default {
  title: 'Components/ContextMenu',
  args: {
    items,
    children: <Region />,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ContextMenuProps>;

export const Playground: Story<ContextMenuProps> = (args) => (
  <ContextMenu {...args} />
);
