import type { ComponentMeta } from '../component-meta-types';

// ContextMenu reuses the `menu` style scope, so its anatomy selectors and
// component tokens resolve against `menu`.
export const meta: ComponentMeta = {
  scope: 'menu',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Required region that opens the menu on right-click or long-press.',
    },
    {
      name: 'items',
      type: 'MenuItem[]',
      description:
        'Required recursive menu contents, including groups, options, and nested submenus.',
    },
    {
      name: 'onSelect',
      type: '(value: string) => void',
      description: 'Called with the value of the selected command.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'Initial open state for uncontrolled usage.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called whenever the open state changes.',
    },
  ],
  anatomy: [
    {
      part: 'positioner',
      description: 'Positions the floating panel at the pointer.',
    },
    { part: 'content', description: 'The translucent menu panel.' },
    { part: 'item', description: 'A selectable command.' },
    { part: 'trigger-item', description: 'A nested-menu trigger.' },
    { part: 'item-icon', description: 'A leading icon on a command.' },
    { part: 'item-text', description: 'The command label.' },
    {
      part: 'submenu-indicator',
      description: 'Directional affordance on a nested-menu trigger.',
    },
    {
      part: 'item-shortcut',
      description: 'The trailing keyboard-shortcut hint.',
    },
    { part: 'item-group-label', description: 'The title of a command group.' },
    { part: 'separator', description: 'A horizontal divider between groups.' },
  ],
};
