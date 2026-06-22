import type { ComponentMeta } from '../component-meta-types';

// PasswordInput renders the shared `field` shell (so its anatomy and component
// tokens are the field's), plus two of its own parts under the `password-input`
// scope — documented in prose on the page since the anatomy table shows one scope.
export const meta: ComponentMeta = {
  scope: 'field',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Field label.',
    },
    {
      name: 'hint',
      type: 'ReactNode',
      description: 'Helper text shown below when there is no error.',
    },
    {
      name: 'error',
      type: 'ReactNode',
      description: 'Error message. Presence flips the field to invalid and replaces the hint.',
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
      default: 'false',
      description: 'Stretch to fill the available inline space.',
    },
    {
      name: 'showVisibilityToggle',
      type: 'boolean',
      default: 'true',
      description: 'Render the show/hide toggle button.',
    },
    {
      name: 'visible / defaultVisible',
      type: 'boolean',
      default: 'false',
      description: 'Controlled / uncontrolled visibility of the password text.',
    },
    {
      name: 'onVisibilityChange',
      type: '(visible: boolean) => void',
      description: 'Called whenever the visibility is toggled.',
    },
    {
      name: 'showCapsLockWarning',
      type: 'boolean',
      default: 'true',
      description: 'Warn the user while Caps Lock is on.',
    },
    {
      name: 'capsLockLabel',
      type: 'ReactNode',
      default: `'Caps Lock is on'`,
      description: 'Caps Lock warning copy.',
    },
    {
      name: 'showLabel / hideLabel',
      type: 'string',
      default: `'Show password' / 'Hide password'`,
      description: 'Accessible labels for the toggle button.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The field wrapper.' },
    { part: 'label', description: 'The field label.' },
    { part: 'control', description: 'The input shell holding the input and affordances.' },
    { part: 'input', description: 'The password input element.' },
    { part: 'hint', description: 'Helper text.' },
    { part: 'error', description: 'Error message (when invalid).' },
  ],
};
