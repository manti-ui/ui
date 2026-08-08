import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'menu',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        'Required element that opens the menu. Cloned with the machine trigger props.',
    },
    {
      name: 'items',
      type: 'MenuItem[]',
      description:
        'Required recursive contents: commands, checkbox/radio choices, separators, groups, and `{ type: "submenu", value, label, items }` entries.',
    },
    {
      name: 'getItemProps',
      type: '(item: MenuCommand) => MenuItemRootProps',
      description:
        'Add class, style, ARIA, data attributes, or handlers to item roots.',
    },
    {
      name: 'contentProps',
      type: 'HTMLAttributes<HTMLDivElement>',
      description: 'Props merged onto the floating menu content.',
    },
    {
      name: 'placement',
      type: `'top' | 'bottom' | 'bottom-center' | 'left' | 'right' | '…-start' | '…-end'`,
      default: `'bottom-start'`,
      description:
        'Placement relative to the trigger. `bottom-center` is an explicit alias for the centered `bottom` placement.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description:
        'Row rhythm of the panel: type, padding, and icon size. Submenus inherit it.',
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
    {
      name: 'ariaLabel',
      type: 'string',
      description: 'Accessible name for the root menu panel.',
    },
  ],
  anatomy: [
    {
      part: 'content',
      description: 'The translucent dropdown panel holding the items.',
    },
    {
      part: 'item',
      description: 'A single selectable command.',
    },
    {
      part: 'trigger-item',
      description: 'A command that opens a nested menu.',
    },
    {
      part: 'item-icon',
      description: 'Leading icon or affordance on a command.',
    },
    {
      part: 'item-text',
      description: 'The command label.',
    },
    {
      part: 'item-shortcut',
      description: 'Trailing hint, e.g. a keyboard shortcut.',
    },
    {
      part: 'item-indicator',
      description: 'Checked indicator for checkbox and radio items.',
    },
    {
      part: 'submenu-indicator',
      description: 'Directional affordance shown on a submenu trigger.',
    },
    {
      part: 'item-group-label',
      description: 'The heading of a titled group of commands.',
    },
    {
      part: 'separator',
      description: 'A divider between groups of items.',
    },
  ],
};
