import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Menu } from './Menu';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    placement: 'bottom-start',
    trigger: <Button variant="tertiary">Serve as…</Button>,
    items: [
      { value: 'yogurt', label: 'Garlic yogurt', shortcut: '⌘1' },
      { value: 'butter', label: 'Chili butter', shortcut: '⌘2' },
      { value: 'broth', label: 'In broth', shortcut: '⌘3' },
      { type: 'separator' },
      { value: 'plain', label: 'Plain', disabled: true },
    ],
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BottomCenter: Story = {
  args: {
    placement: 'bottom-center',
    trigger: <Button variant="tertiary">Open bottom-center menu</Button>,
  },
};

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

export const Nested: Story = {
  args: {
    trigger: <Button variant="tertiary">File</Button>,
    items: [
      { value: 'new', label: 'New file', shortcut: '⌘N' },
      {
        type: 'submenu',
        value: 'share',
        label: 'Share',
        items: [
          { value: 'messages', label: 'Messages' },
          { value: 'mail', label: 'Mail' },
          {
            type: 'submenu',
            value: 'more',
            label: 'More',
            items: [
              { value: 'airdrop', label: 'AirDrop' },
              { value: 'notes', label: 'Notes' },
            ],
          },
        ],
      },
      { type: 'separator' },
      { value: 'print', label: 'Print…', shortcut: '⌘P' },
    ],
  },
};

export const OptionsAndDanger: Story = {
  render: (args) => {
    const [compact, setCompact] = useState(true);
    const [theme, setTheme] = useState('system');
    return (
      <Menu
        {...args}
        items={[
          {
            type: 'checkbox',
            value: 'compact',
            label: 'Compact density',
            checked: compact,
            closeOnSelect: false,
            onCheckedChange: setCompact,
          },
          {
            type: 'group',
            label: 'Theme',
            items: ['light', 'dark', 'system'].map((value) => ({
              type: 'radio' as const,
              value,
              label: value,
              checked: theme === value,
              onCheckedChange: () => setTheme(value),
            })),
          },
          { type: 'separator' },
          {
            value: 'delete',
            label: 'Delete account',
            tone: 'danger',
          },
        ]}
      />
    );
  },
};
