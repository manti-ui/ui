import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'toggle-group',
  props: [
    {
      name: 'items',
      type: 'ToggleGroupItem[]',
      description: 'The options — each `{ value, label, disabled? }`.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control size.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Active tone for pressed items.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      description: 'Allow more than one item to be pressed at once.',
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'Controlled pressed values.',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial pressed values for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the pressed set changes.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Layout axis and arrow-key direction.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the whole group.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The wrapper that owns size, tone, and orientation.',
    },
    { part: 'item', description: 'A single toggle button.' },
  ],
};
