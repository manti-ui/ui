import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'select',
  props: [
    {
      name: 'items',
      type: 'SelectItem[]',
      description: 'The options. Each is `{ value, label, disabled? }`.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: `'Select…'`,
      description: 'Text shown when nothing is selected.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Selected-item tone.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control size.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      description: 'Allow selecting more than one option.',
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
      name: 'placement',
      type: 'Placement',
      default: `'bottom-start'`,
      description: 'Placement of the listbox relative to the trigger.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
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
    { part: 'trigger', description: 'The button that opens the listbox.' },
    {
      part: 'value-text',
      description: 'The selected value (or placeholder) text.',
    },
    { part: 'indicator', description: 'The chevron on the trigger.' },
    {
      part: 'positioner',
      description: 'The portalled wrapper positioning the listbox.',
    },
    { part: 'content', description: 'The translucent listbox panel.' },
    { part: 'item', description: 'Each selectable option.' },
    {
      part: 'item-indicator',
      description: 'The checkmark shown on the selected option.',
    },
  ],
};
