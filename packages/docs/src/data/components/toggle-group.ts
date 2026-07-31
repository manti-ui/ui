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
      name: 'variant',
      type: 'MantiVariant',
      default: `'primary'`,
      description: 'Active variant for pressed items.',
    },
    {
      name: 'type',
      type: `'single' | 'multiple'`,
      description:
        'Selection mode. Single mode uses scalar string values; multiple mode uses arrays.',
    },
    {
      name: 'value',
      type: 'string | string[]',
      description: 'Controlled pressed values.',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      description: 'Initial pressed values for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string | string[]) => void',
      description: 'Called whenever the pressed set changes.',
    },
    {
      name: 'rootProps',
      type: 'HTMLAttributes<HTMLDivElement>',
      description:
        'ARIA, data, style, class, and native props for the group root.',
    },
    {
      name: 'getItemProps',
      type: '(item: ToggleGroupItem) => ButtonHTMLAttributes',
      description: 'Props merged onto every item button.',
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
      description: 'The wrapper that owns size, variant, and orientation.',
    },
    { part: 'item', description: 'A single toggle button.' },
  ],
};
