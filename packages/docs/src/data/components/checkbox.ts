import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'checkbox',
  props: [
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
      description: 'Active tone when checked.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Render the mixed/indeterminate state.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Optional trailing label.',
    },
    {
      name: 'checked',
      type: 'boolean',
      description: 'Controlled checked state.',
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: 'Initial checked state for uncontrolled usage.',
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      description: 'Called whenever the checked state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      description: 'Mark the control as invalid.',
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'Require the control in a form.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Make the control read-only.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Form field value when checked.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The label wrapping the control and text.' },
    { part: 'control', description: 'The square box that shows the check.' },
    {
      part: 'indicator',
      description: 'The drawn check or dash inside the box.',
    },
    {
      part: 'label',
      description: 'The trailing text label, when `children` is set.',
    },
  ],
};
