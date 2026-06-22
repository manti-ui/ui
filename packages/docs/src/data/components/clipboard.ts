import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'clipboard',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The value to copy to the clipboard.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label rendered above the field.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'success'`,
      description: 'Tone of the copied indicator.',
    },
    {
      name: 'timeout',
      type: 'number',
      description: 'How long the copied state lasts, in milliseconds.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The wrapper around the label and control.' },
    { part: 'label', description: 'The label element above the field.' },
    {
      part: 'control',
      description: 'The row holding the input and copy button.',
    },
    { part: 'input', description: 'The read-only input showing the value.' },
    { part: 'trigger', description: 'The button that copies the value.' },
    {
      part: 'indicator',
      description: 'The icon that swaps between copy and copied states.',
    },
  ],
};
