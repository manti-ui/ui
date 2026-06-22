import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'pin-input',
  props: [
    {
      name: 'length',
      type: 'number',
      default: '4',
      description: 'Number of input cells.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Cell size.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Focus-ring tone.',
    },
    {
      name: 'type',
      type: `'alphanumeric' | 'numeric' | 'alphabetic'`,
      description: 'Allowed character type.',
    },
    {
      name: 'mask',
      type: 'boolean',
      description: 'Mask entered characters like a password field.',
    },
    {
      name: 'otp',
      type: 'boolean',
      description: 'Hint the field is a one-time code (sets autocomplete).',
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'Controlled value.',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called on every change.',
    },
    {
      name: 'onValueComplete',
      type: '(value: string[], valueAsString: string) => void',
      description: 'Called once every cell is filled.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder shown in empty cells.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the field.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Make the field read-only.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      description: 'Mark the field as invalid.',
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'Mark the field as required.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The field wrapper.' },
    { part: 'label', description: 'The optional field label.' },
    { part: 'control', description: 'The row that lays out the input cells.' },
    { part: 'input', description: 'Each individual code-entry cell.' },
  ],
};
