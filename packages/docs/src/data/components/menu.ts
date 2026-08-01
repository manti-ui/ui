import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'menu',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        'Element that opens the menu. Cloned with the machine trigger props. Composition alternative: a `Menu.Trigger` child.',
    },
    {
      name: 'items',
      type: 'MenuItem[]',
      description:
        'The menu contents: commands, separators (`{ type: "separator" }`), or groups (`{ type: "group", label, items }`). Omit it to compose the parts as children instead.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Composed parts — `Menu.Trigger` and `Menu.Content` — used when `items` is omitted.',
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
      part: 'content',
      description: 'The translucent dropdown panel holding the items.',
    },
    {
      part: 'item',
      description: 'A single selectable command.',
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
      part: 'item-group-label',
      description: 'The heading of a titled group of commands.',
    },
    {
      part: 'separator',
      description: 'A divider between groups of items.',
    },
  ],
};
