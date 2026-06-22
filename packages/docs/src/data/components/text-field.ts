import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'field',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Field label, associated with the input.',
    },
    {
      name: 'hint',
      type: 'ReactNode',
      description:
        'Helper text shown below the control when there is no error.',
    },
    {
      name: 'error',
      type: 'ReactNode',
      description:
        'Error message. Presence sets the invalid state and replaces the hint.',
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
      name: 'leadingAddon',
      type: 'ReactNode',
      description: 'Content rendered inside the control, before the input.',
    },
    {
      name: 'trailingAddon',
      type: 'ReactNode',
      description: 'Content rendered inside the control, after the input.',
    },
    {
      name: '...rest',
      type: 'InputHTMLAttributes',
      description:
        'Any native input attribute (placeholder, type, value, disabled, required…).',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The field container.' },
    { part: 'label', description: 'The field label.' },
    { part: 'required', description: 'The required asterisk (when required).' },
    {
      part: 'control',
      description: 'The input frame, holding addons and the input.',
    },
    { part: 'addon', description: 'A leading or trailing adornment.' },
    { part: 'input', description: 'The native text input.' },
    { part: 'hint', description: 'Helper text below the control.' },
    {
      part: 'error',
      description: 'Error message below the control (when error).',
    },
  ],
};
