import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'editable',
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
      description: 'Focus-ring tone.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: 'Called whenever the value changes.',
    },
    {
      name: 'onValueCommit',
      type: '(value: string) => void',
      description: 'Called when the value is committed (Enter/blur/submit).',
    },
    {
      name: 'activationMode',
      type: `'focus' | 'dblclick' | 'click' | 'none'`,
      description: 'What enters edit mode.',
    },
    {
      name: 'submitMode',
      type: `'enter' | 'blur' | 'both' | 'none'`,
      description: 'What commits the value.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder shown when empty.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable editing.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Make the field read-only.',
    },
    {
      name: 'required',
      type: 'boolean',
      description: 'Mark the field as required.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      description: 'Mark the field as invalid.',
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
    { part: 'area', description: 'Wraps the preview and the input.' },
    { part: 'preview', description: 'The static text shown when not editing.' },
    { part: 'input', description: 'The text input shown in edit mode.' },
    { part: 'control', description: 'Wraps the edit/save/cancel buttons.' },
    { part: 'edit-trigger', description: 'Enters edit mode.' },
    { part: 'submit-trigger', description: 'Commits the value.' },
    { part: 'cancel-trigger', description: 'Discards the edit.' },
  ],
};
