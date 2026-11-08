import type { Story, StoryDefault } from '@ladle/react';

import { NavigationMenu } from './NavigationMenu.js';
import type { NavigationMenuProps } from './NavigationMenu.js';

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

export default {
  title: 'Components/NavigationMenu',
  args: { items },
  meta: { layout: 'centered' },
} satisfies StoryDefault<NavigationMenuProps>;

export const Playground: Story<NavigationMenuProps> = (args) => (
  <NavigationMenu {...args} />
);
