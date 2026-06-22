import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'combobox',
  props: [
    {
      name: 'items',
      type: 'ComboboxItem[]',
      description:
        'The full option set; filtered client-side as the user types. Each item is { value, label, disabled? }.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: `'Search…'`,
      description: 'Input placeholder text.',
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
      description: 'Placement of the listbox relative to the control.',
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
    {
      part: 'root',
      description: 'The field wrapper; carries data-size and data-tone.',
    },
    { part: 'label', description: 'The field label.' },
    { part: 'control', description: 'Wraps the input and toggle button.' },
    { part: 'input', description: 'The typeahead text input.' },
    {
      part: 'trigger',
      description: 'The button that toggles the listbox open.',
    },
    { part: 'positioner', description: 'Positions the floating listbox.' },
    { part: 'content', description: 'The translucent listbox panel.' },
    { part: 'item', description: 'A selectable option.' },
    {
      part: 'item-indicator',
      description: 'The check mark shown on selected items.',
    },
  ],
};
