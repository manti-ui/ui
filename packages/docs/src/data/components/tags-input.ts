import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'tags-input',
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
      type: 'string[]',
      description: 'Controlled tag values.',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial tag values for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the tag set changes.',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum number of tags.',
    },
    {
      name: 'allowDuplicates',
      type: 'boolean',
      description: 'Allow duplicate tags.',
    },
    {
      name: 'addOnPaste',
      type: 'boolean',
      description: 'Add a tag when pasting delimited text.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder for the entry input.',
    },
    {
      name: 'disabled / readOnly / invalid / required',
      type: 'boolean',
      description: 'Field state flags.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The component container.' },
    { part: 'label', description: 'The optional label.' },
    { part: 'control', description: 'The chips-and-input frame.' },
    { part: 'item-preview', description: 'A rendered tag chip.' },
    {
      part: 'item-delete-trigger',
      description: 'The remove button on a chip.',
    },
    { part: 'item-input', description: 'The inline edit input for a chip.' },
    { part: 'input', description: 'The entry input for new tags.' },
  ],
};
