import { NavigationMenu } from '@manti-ui/react';
import type { NavigationMenuItem } from '@manti-ui/react';

const items: NavigationMenuItem[] = [
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

export default function NavigationMenuBasic() {
  return <NavigationMenu items={items} />;
}
