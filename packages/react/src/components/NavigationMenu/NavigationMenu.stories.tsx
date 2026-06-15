import type { Meta, StoryObj } from '@storybook/react-vite';

import { NavigationMenu } from './NavigationMenu';

const items = [
  {
    value: 'products',
    label: 'Products',
    links: [
      { href: '#components', label: 'Components', description: '40+ adapters' },
      { href: '#tokens', label: 'Tokens', description: 'The design contract' },
    ],
  },
  {
    value: 'resources',
    label: 'Resources',
    links: [
      { href: '#docs', label: 'Docs', description: 'Guides & API' },
      { href: '#blog', label: 'Blog', description: 'Updates & notes' },
    ],
  },
];

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { items },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
