import type { Meta, StoryObj } from '@storybook/react-vite';

import { ContextMenu } from './ContextMenu';
import type { MenuItem } from '../Menu/Menu';

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

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items,
    children: <Region />,
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
