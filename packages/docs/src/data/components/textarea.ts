import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'field',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Field label, associated with the textarea.',
    },
    {
      name: 'hint',
      type: 'ReactNode',
      description:
        'Helper text shown below the control when there is no error.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Alias for hint, useful for textarea helper copy.',
    },
    {
      name: 'error',
      type: 'ReactNode',
      description:
        'Error message. Presence sets the invalid state and replaces helper text.',
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
      description: 'Tone used for the focus ring.',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      description: 'Stretch to fill the available inline space.',
    },
    {
      name: 'rows',
      type: 'number',
      default: '3',
      description: 'Initial textarea height in text rows.',
    },
    {
      name: 'autoResize',
      type: 'boolean',
      description: 'Grow the textarea to fit its content.',
    },
    {
      name: 'maxHeight',
      type: 'CSSProperties["maxHeight"]',
      description: 'Maximum height used with autoResize or native scrolling.',
    },
    {
      name: 'resize',
      type: `'none' | 'vertical'`,
      default: `'vertical'`,
      description: 'Native resize affordance.',
    },
    {
      name: '...rest',
      type: 'TextareaHTMLAttributes',
      description:
        'Any native textarea attribute (placeholder, value, onChange, maxLength, disabled, required...).',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The field container.' },
    { part: 'label', description: 'The field label.' },
    { part: 'required', description: 'The required asterisk (when required).' },
    { part: 'control', description: 'The textarea frame.' },
    { part: 'input', description: 'The native textarea.' },
    { part: 'hint', description: 'Helper text below the control.' },
    {
      part: 'error',
      description: 'Error message below the control (when error).',
    },
  ],
};
