import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'combobox',
  props: [
    {
      name: 'items',
      type: 'ComboboxItem[]',
      description:
        'The option set, filtered client-side by label as the user types unless filter says otherwise. Each item is { value, label, disabled? }.',
    },
    {
      name: 'filter',
      type: 'false | ((item: ComboboxItem, query: string) => boolean)',
      description:
        'How items are matched against the typed text. false renders items as given (a remote search); a function replaces the built-in label match.',
    },
    {
      name: 'inputValue',
      type: 'string',
      description: 'Controlled text in the input.',
    },
    {
      name: 'defaultInputValue',
      type: 'string',
      description: 'Initial text in the input for uncontrolled usage.',
    },
    {
      name: 'onInputValueChange',
      type: '(value: string) => void',
      description:
        'Called with the input text on every edit, and when a pick rewrites it.',
    },
    {
      name: 'minChars',
      type: 'number',
      default: '0',
      description:
        'How many characters the typed text needs before typing opens the listbox. The toggle button still opens it at any length.',
    },
    {
      name: 'loading',
      type: 'boolean',
      description:
        'Show a loading row in the open listbox, announced through role="status".',
    },
    {
      name: 'emptyContent',
      type: 'ReactNode',
      description:
        'Shown in the open listbox when it has no rows and is not loading.',
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
      name: 'variant',
      type: `'default' | 'fill'`,
      default: `'default'`,
      description: 'Visual treatment for the control.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control size.',
    },
    {
      name: 'maxVisibleItems',
      type: 'number',
      default: '200',
      description:
        'How many matching rows the listbox renders at once. Typing filters the whole item set; a line under the rows says how many matches are still hidden.',
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
      description: 'The field wrapper; carries data-size and data-variant.',
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
    {
      part: 'loading',
      description: 'The status row shown while loading is set.',
    },
    {
      part: 'empty',
      description:
        'The status row holding emptyContent when there are no rows.',
    },
    {
      part: 'overflow-hint',
      description:
        'The line under the rows when more matches exist than maxVisibleItems.',
    },
  ],
};
