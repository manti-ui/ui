import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'slider',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label rendered above the track.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone of the filled track and thumb.',
    },
    {
      name: 'value',
      type: 'number | number[]',
      description: 'Controlled value. Pass an array for a range slider.',
    },
    {
      name: 'defaultValue',
      type: 'number | number[]',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: number[]) => void',
      description: 'Called whenever the value changes.',
    },
    {
      name: 'onValueChangeEnd',
      type: '(value: number[]) => void',
      description: 'Called when a drag or keyboard interaction settles.',
    },
    {
      name: 'min / max',
      type: 'number',
      description: 'Lower and upper bounds of the range.',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Increment between selectable values.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Layout direction.',
    },
    {
      name: 'marks',
      type: 'number[]',
      description: 'Tick marks rendered along the track.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      description: 'Show the current value next to the label.',
    },
    {
      name: 'disabled / readOnly / invalid',
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
    { part: 'header', description: 'Wraps the label and value text.' },
    { part: 'label', description: 'The optional label.' },
    { part: 'value-text', description: 'The current value output.' },
    { part: 'control', description: 'The interactive track region.' },
    { part: 'track', description: 'The full-length rail.' },
    { part: 'range', description: 'The filled portion up to the thumb.' },
    { part: 'thumb', description: 'A draggable handle (one per value).' },
    { part: 'marker-group', description: 'Wraps the tick marks.' },
    { part: 'marker', description: 'A single tick mark.' },
  ],
};
