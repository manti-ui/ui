import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'time-picker',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label rendered above the control.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Selection-highlight tone for the active cells.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial value as "HH:mm" (24-hour).',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description:
        'Called whenever the value changes; emits the formatted time string.',
    },
    {
      name: 'placement',
      type: 'Placement',
      default: `'bottom-start'`,
      description: 'Placement of the panel relative to the control.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
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
  ],
  anatomy: [
    { part: 'root', description: 'The outer wrapper that owns the tone.' },
    { part: 'label', description: 'The optional field label.' },
    { part: 'control', description: 'The input plus trigger row.' },
    {
      part: 'input',
      description: 'The text input that holds the formatted time.',
    },
    { part: 'trigger', description: 'The button that opens the panel.' },
    {
      part: 'positioner',
      description: 'The floating wrapper that positions the panel.',
    },
    {
      part: 'content',
      description: 'The panel holding the hour/minute/period columns.',
    },
    {
      part: 'column',
      description: 'A scrollable column of cells for one unit.',
    },
    {
      part: 'cell',
      description: 'A selectable hour, minute, or period option.',
    },
  ],
};
