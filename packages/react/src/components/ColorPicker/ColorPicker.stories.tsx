import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColorPicker } from './ColorPicker';

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Accent color',
    defaultValue: '#7c3aed',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    format: {
      control: 'inline-radio',
      options: ['hex', 'rgba', 'hsla', 'hsba', 'oklch'],
    },
    formats: {
      control: 'object',
      description: 'Formats shown in the copy tabs.',
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Trigger shows only the color swatch, hiding the formatted value text. */
export const SwatchOnly: Story = {
  args: { showValueText: false },
};

/** The palette and output stay in native OKLCH until another format is selected. */
export const Oklch: Story = {
  args: {
    colorSpace: 'oklch',
    format: 'oklch',
    formats: ['hex', 'rgba', 'oklch'],
  },
};

/** Hex output includes alpha only while the selected color is translucent. */
export const HexWithAlpha: Story = {
  args: {
    format: 'hex',
    formats: ['hex', 'rgba'],
    defaultValue: 'rgba(124, 58, 237, 0.5)',
  },
};
