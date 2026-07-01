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
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Trigger shows only the color swatch, hiding the formatted value text. */
export const SwatchOnly: Story = {
  args: { showValueText: false },
};
