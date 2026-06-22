import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'navigation-menu',
  props: [
    {
      name: 'items',
      type: 'NavigationMenuItem[]',
      description:
        'The top-level menus. Each is `{ value, label, links }` where each link is `{ href, label, description? }`.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled open menu value.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial open menu for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called whenever the open menu changes.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The `<nav>` wrapper.',
    },
    {
      part: 'list',
      description: 'The row of top-level triggers.',
    },
    {
      part: 'trigger',
      description: 'A top-level menu button that opens its dropdown.',
    },
    {
      part: 'content',
      description: 'The dropdown panel holding the links for one menu.',
    },
    {
      part: 'link',
      description: 'A single navigation link inside a dropdown.',
    },
    {
      part: 'indicator',
      description:
        'The sliding indicator and arrow that point at the open menu.',
    },
  ],
};
