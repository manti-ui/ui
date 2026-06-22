import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'radio-group',
  props: [
    {
      name: 'items',
      type: 'RadioGroupItem[]',
      description: 'The options. Each is `{ value, label, disabled? }`.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional group label.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Active tone when an option is selected.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled selected value.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial selected value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called whenever the selected value changes.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'vertical'`,
      description: 'Layout direction.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the entire group.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The group wrapper.' },
    { part: 'label', description: 'The optional group label.' },
    { part: 'item', description: 'Each selectable option row.' },
    {
      part: 'item-control',
      description: 'The radio dot rendered for each item.',
    },
    { part: 'item-text', description: 'Each item label.' },
  ],
};
