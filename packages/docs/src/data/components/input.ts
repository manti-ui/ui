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
      name: 'variant',
      type: 'MantiVariant',
      default: `'primary'`,
      description: 'Variant used for the focus ring.',
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
    {
      name: 'showPasswordToggle',
      type: 'boolean',
      default: 'true',
      description: 'type="password" only — render the show/hide toggle button.',
    },
    {
      name: 'passwordVisible',
      type: 'boolean',
      description:
        'type="password" only — controlled visibility of the password text.',
    },
    {
      name: 'defaultPasswordVisible',
      type: 'boolean',
      default: 'false',
      description:
        'type="password" only — initial visibility for uncontrolled usage.',
    },
    {
      name: 'onPasswordVisibilityChange',
      type: '(visible: boolean) => void',
      description:
        'type="password" only — called whenever the visibility is toggled.',
    },
    {
      name: 'showCapsLockWarning',
      type: 'boolean',
      default: 'true',
      description: 'type="password" only — warn while Caps Lock is on.',
    },
    {
      name: 'capsLockLabel',
      type: 'ReactNode',
      default: `'Caps Lock is on'`,
      description:
        'type="password" only — Caps Lock wording. Shown to assistive tech only; the warning reads as an icon on screen.',
    },
    {
      name: 'showPasswordLabel',
      type: 'string',
      default: `'Show password'`,
      description:
        'type="password" only — accessible label for the toggle while hidden.',
    },
    {
      name: 'hidePasswordLabel',
      type: 'string',
      default: `'Hide password'`,
      description:
        'type="password" only — accessible label for the toggle while shown.',
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
    {
      part: 'visibility-trigger',
      description: 'The show/hide button (type="password" only).',
    },
    {
      part: 'caps-lock',
      description:
        'The Caps Lock icon (type="password", while Caps Lock is on).',
    },
    {
      part: 'caps-lock-label',
      description:
        'The Caps Lock wording. Visually hidden — kept for assistive tech.',
    },
    { part: 'hint', description: 'Helper text below the control.' },
    {
      part: 'error',
      description: 'Error message below the control (when error).',
    },
  ],
};
