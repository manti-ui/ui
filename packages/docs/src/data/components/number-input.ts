import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'number-input',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label.',
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
      description: 'Focus-ring tone.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value, mirroring the input string.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string, valueAsNumber: number) => void',
      description: 'Called whenever the value changes.',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Minimum allowed value.',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum allowed value.',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Increment/decrement step.',
    },
    {
      name: 'allowMouseWheel',
      type: 'boolean',
      description: 'Allow the mouse wheel to change the value while focused.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      description: 'Mark the field as invalid.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Make the field read-only.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The field wrapper carrying scope, size, tone, and state.',
    },
    {
      part: 'label',
      description: 'Optional label above the control.',
    },
    {
      part: 'control',
      description: 'The framed group holding the input and the two triggers.',
    },
    {
      part: 'input',
      description: 'The text input that reflects the numeric value.',
    },
    {
      part: 'decrement-trigger',
      description: 'Button that steps the value down.',
    },
    {
      part: 'increment-trigger',
      description: 'Button that steps the value up.',
    },
  ],
};
