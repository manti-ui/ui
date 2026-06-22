import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'segmented-control',
  props: [
    {
      name: 'items',
      type: 'SegmentedControlItem[]',
      description: 'The segments. Each is `{ value, label, disabled? }`.',
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
      description: 'Tone used for the focus ring.',
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
      default: `'horizontal'`,
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
      description: 'Disable the entire control.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The segmented container.' },
    { part: 'indicator', description: 'The pill that slides to the active segment.' },
    { part: 'item', description: 'Each selectable segment.' },
    { part: 'item-text', description: 'Each segment label.' },
  ],
};
