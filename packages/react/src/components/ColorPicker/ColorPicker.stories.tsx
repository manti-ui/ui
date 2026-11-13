import type { Story, StoryDefault } from '@ladle/react';

import { ColorPicker } from './ColorPicker.js';
import type { ColorPickerProps } from './ColorPicker.js';

const formatOptions = ['hex', 'rgba', 'hsla', 'hsba', 'oklch'];

export default {
  title: 'Components/ColorPicker',
  args: {
    label: 'Accent color',
    defaultValue: '#7c3aed',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    format: {
      control: { type: 'inline-radio' },
      options: formatOptions,
    },
    // Ladle has no `object` control; the format list is a set of known
    // strings, so a check control edits it.
    formats: {
      control: { type: 'check' },
      options: formatOptions,
      description: 'Formats shown in the copy tabs.',
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ColorPickerProps>;

export const Playground: Story<ColorPickerProps> = (args) => (
  <ColorPicker {...args} />
);

/** Trigger shows only the color swatch, hiding the formatted value text. */
export const SwatchOnly: Story<ColorPickerProps> = (args) => (
  <ColorPicker {...args} />
);
SwatchOnly.args = { showValueText: false };

/** The palette and output stay in native OKLCH until another format is selected. */
export const Oklch: Story<ColorPickerProps> = (args) => (
  <ColorPicker {...args} />
);
Oklch.args = {
  colorSpace: 'oklch',
  format: 'oklch',
  formats: ['hex', 'rgba', 'oklch'],
};

/** Hex output includes alpha only while the selected color is translucent. */
export const HexWithAlpha: Story<ColorPickerProps> = (args) => (
  <ColorPicker {...args} />
);
HexWithAlpha.args = {
  format: 'hex',
  formats: ['hex', 'rgba'],
  defaultValue: 'rgba(124, 58, 237, 0.5)',
};
