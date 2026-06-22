import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'toggle',
  props: [
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Active tone when the toggle is pressed.',
    },
    {
      name: 'pressed',
      type: 'boolean',
      description: 'Controlled pressed state.',
    },
    {
      name: 'defaultPressed',
      type: 'boolean',
      description: 'Initial pressed state for uncontrolled usage.',
    },
    {
      name: 'onPressedChange',
      type: '(pressed: boolean) => void',
      description: 'Called whenever the pressed state changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      description:
        'Render as a square, icon-only toggle. Provide an aria-label.',
    },
    {
      name: 'children',
      type: 'ReactNode | ((pressed: boolean) => ReactNode)',
      description:
        'Content, or a render function receiving the current pressed state.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description:
        'The pressable button. Off reads as a quiet outline; on fills with the tone.',
    },
  ],
};
