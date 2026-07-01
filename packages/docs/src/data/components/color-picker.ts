import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'color-picker',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional field label.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value as a CSS color string.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      default: `'#7c3aed'`,
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description:
        'Called whenever the value changes; emits a CSS color string.',
    },
    {
      name: 'showValueText',
      type: 'boolean',
      default: 'true',
      description:
        'Show the formatted value text (e.g. rgba(...)) next to the swatch in the trigger. Set to false to show only the color swatch.',
    },
    {
      name: 'placement',
      type: 'Placement',
      default: `'bottom-start'`,
      description: 'Placement of the panel relative to the control.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the control.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name for the hidden input.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The field wrapper.' },
    { part: 'label', description: 'The field label.' },
    {
      part: 'trigger',
      description:
        'The button that opens the picker; shows the current swatch and value.',
    },
    {
      part: 'value-swatch',
      description: 'The current-color preview chip in the trigger.',
    },
    { part: 'positioner', description: 'Positions the floating panel.' },
    { part: 'content', description: 'The translucent picker panel.' },
    { part: 'area', description: 'The saturation/value selection area.' },
    {
      part: 'area-background',
      description: 'The hue-tinted backdrop of the area.',
    },
    { part: 'area-thumb', description: 'The draggable area handle.' },
    {
      part: 'channel-slider',
      description: 'A hue or alpha slider track wrapper.',
    },
    {
      part: 'channel-slider-track',
      description: 'The gradient track of a channel slider.',
    },
    {
      part: 'channel-slider-thumb',
      description: 'The draggable channel-slider handle.',
    },
    {
      part: 'transparency-grid',
      description: 'The checkerboard behind the alpha slider.',
    },
    { part: 'channel-input', description: 'The hex text input.' },
  ],
};
