import type { Meta, StoryObj } from '@storybook/react-vite';

import { Menu } from './Menu';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    placement: 'bottom-start',
    trigger: <Button variant="outline">Serve as…</Button>,
    items: [
      { value: 'yogurt', label: 'Garlic yogurt', shortcut: '⌘1' },
      { value: 'butter', label: 'Chili butter', shortcut: '⌘2' },
      { value: 'broth', label: 'In broth', shortcut: '⌘3' },
      { type: 'separator' },
      { value: 'plain', label: 'Plain', disabled: true },
    ],
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Grouped: Story = {
  args: {
    items: [
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
    ],
  },
};
