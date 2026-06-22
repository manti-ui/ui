import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'date-picker',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Selection-highlight tone.',
    },
    {
      name: 'selectionMode',
      type: `'single' | 'multiple' | 'range'`,
      default: `'single'`,
      description: 'Single, multiple, or range selection.',
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'Controlled value as ISO date strings (YYYY-MM-DD).',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the value changes; emits ISO date strings.',
    },
    {
      name: 'locale',
      type: 'string',
      description: 'BCP-47 locale for formatting.',
    },
    {
      name: 'placement',
      type: 'Placement',
      default: `'bottom-start'`,
      description: 'Placement of the calendar relative to the control.',
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
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The field wrapper; carries data-tone.' },
    { part: 'label', description: 'The field label.' },
    { part: 'control', description: 'Wraps the input and calendar trigger.' },
    { part: 'input', description: 'The text input for typed dates.' },
    { part: 'trigger', description: 'The button that opens the calendar.' },
    { part: 'positioner', description: 'Positions the floating calendar.' },
    { part: 'content', description: 'The frosted calendar panel.' },
    {
      part: 'view-control',
      description: 'The month header with prev/next navigation.',
    },
    { part: 'prev-trigger', description: 'Navigates to the previous month.' },
    { part: 'next-trigger', description: 'Navigates to the next month.' },
    {
      part: 'view-trigger',
      description: 'Switches between day, month, and year views.',
    },
    { part: 'table', description: 'The day grid.' },
    { part: 'table-head', description: 'A weekday column header.' },
    { part: 'table-cell', description: 'A day cell.' },
    { part: 'table-cell-trigger', description: 'The selectable day button.' },
  ],
};
