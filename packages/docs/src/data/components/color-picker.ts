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
      description:
        'Initial CSS color value for uncontrolled usage. Hex, rgba, hsla, hsba, and oklch strings are accepted.',
    },
    {
      name: 'format',
      type: 'ColorPickerFormat',
      default: `'rgba'`,
      description:
        'Output format used by the trigger, editable value field, selected copy tab, and onValueChange callback.',
    },
    {
      name: 'defaultFormat',
      type: 'ColorPickerFormat',
      default: `'rgba'`,
      description:
        'Initial output format when format is uncontrolled. The selected format is always included in the copy tabs.',
    },
    {
      name: 'colorSpace',
      type: 'ColorSpaceId',
      description:
        'Color space used by the interactive palette. `oklch` keeps area and channel changes in native OKLCH values.',
    },
    {
      name: 'formats',
      type: 'readonly ColorPickerFormat[]',
      default: `['hex', 'rgba', 'hsla']`,
      description:
        'Formats shown in the copy tabs. The selected format is included automatically when it is not in this list.',
    },
    {
      name: 'onFormatChange',
      type: '(format: ColorPickerFormat) => void',
      description: 'Called when a copy tab changes the selected color format.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description:
        'Called whenever the value changes; emits a CSS color string in the selected format.',
    },
    {
      name: 'showValueText',
      type: 'boolean',
      default: 'true',
      description:
        'Show the formatted value text (e.g. rgba(...)) next to the swatch in the trigger. Set to false to show only the color swatch.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description:
        'Trigger size: height, padding, type, and swatch. The panel receives the same size channel.',
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
    {
      part: 'area',
      description:
        'The two-dimensional color selection area; in OKLCH, its axes are chroma and lightness.',
    },
    {
      part: 'area-background',
      description: 'The hue-tinted backdrop of the area.',
    },
    { part: 'area-thumb', description: 'The draggable area handle.' },
    {
      part: 'channel-slider',
      description: 'A color-space channel slider track wrapper.',
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
    {
      part: 'copy-row',
      description:
        'Row holding the format tabs (a nested Manti Tabs) and the eyedropper Button; a Manti Clipboard below it shows the color in the selected format.',
    },
  ],
};
