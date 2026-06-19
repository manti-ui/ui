import type { Meta, StoryObj } from '@storybook/react-vite';

import { QrCode } from './QrCode';

const meta = {
  title: 'Components/QrCode',
  component: QrCode,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: 'https://manti.design',
    size: 160,
  },
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Large: Story = {
  args: { size: 240, value: 'One dough, countless fillings.' },
};
