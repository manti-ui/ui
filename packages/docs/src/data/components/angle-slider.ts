import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'angle-slider',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label rendered above the dial.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone of the thumb and markers.',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Snap step in degrees.',
    },
    {
      name: 'value',
      type: 'number',
      description: 'Controlled angle (0–360).',
    },
    {
      name: 'defaultValue',
      type: 'number',
      description: 'Initial angle for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: number) => void',
      description: 'Called whenever the angle changes.',
    },
    {
      name: 'marks',
      type: 'number[]',
      description: 'Tick marks rendered at the given degrees.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Show the current degree value as text.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the dial.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Make the dial read-only.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name for the hidden input.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The wrapper around the label, dial, and value.',
    },
    { part: 'label', description: 'The label element above the dial.' },
    {
      part: 'control',
      description: 'The circular track the thumb rotates around.',
    },
    {
      part: 'thumb',
      description: 'The draggable marker indicating the angle.',
    },
    {
      part: 'marker',
      description: 'A tick mark at one of the `marks` degrees.',
    },
    { part: 'value-text', description: 'The text showing the current degree.' },
  ],
};
