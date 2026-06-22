import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'menu',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        'Element that opens the menu. Cloned with the machine trigger props.',
    },
    {
      name: 'items',
      type: 'MenuItem[]',
      description:
        'The menu contents: commands, separators (`{ type: "separator" }`), or groups (`{ type: "group", label, items }`).',
    },
    {
      name: 'placement',
      type: `'top' | 'bottom' | 'left' | 'right' | '…-start' | '…-end'`,
      default: `'bottom-start'`,
      description: 'Placement of the menu relative to the trigger.',
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
      description: 'The frosted dropdown panel holding the items.',
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
      part: 'item-group-label',
      description: 'The heading of a titled group of commands.',
    },
    {
      part: 'separator',
      description: 'A divider between groups of items.',
    },
  ],
};
