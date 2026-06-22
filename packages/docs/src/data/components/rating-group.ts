import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'rating-group',
  props: [
    {
      name: 'count',
      type: 'number',
      default: '5',
      description: 'Number of rating icons.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'warning'`,
      description: 'Filled-icon tone.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control size.',
    },
    {
      name: 'allowHalf',
      type: 'boolean',
      description: 'Allow half-star precision.',
    },
    {
      name: 'value',
      type: 'number',
      description: 'Controlled value.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: number) => void',
      description: 'Called whenever the value changes.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Display the rating without allowing edits.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The control wrapper.' },
    { part: 'label', description: 'The optional label.' },
    { part: 'control', description: 'The row of rating icons.' },
    { part: 'item', description: 'Each individual rating icon.' },
    { part: 'star-bg', description: 'The empty (background) star layer.' },
    { part: 'star-fill', description: 'The filled star layer.' },
  ],
};
