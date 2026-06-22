import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'listbox',
  props: [
    {
      name: 'items',
      type: 'ListboxItem[]',
      description: 'The options. Each item is `{ value, label, disabled? }`.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label rendered above the list.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone applied to the selected item.',
    },
    {
      name: 'selectionMode',
      type: `'single' | 'multiple'`,
      default: `'single'`,
      description: 'Whether one or several items can be selected.',
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'Controlled selected values.',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial selected values for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the selection changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the whole list.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The list wrapper carrying scope, tone, and state.',
    },
    {
      part: 'label',
      description: 'Optional label above the list.',
    },
    {
      part: 'content',
      description: 'The scrollable `<ul>` holding the options.',
    },
    {
      part: 'item',
      description: 'A single selectable option.',
    },
    {
      part: 'item-indicator',
      description: 'The checkmark shown on selected items.',
    },
  ],
};
