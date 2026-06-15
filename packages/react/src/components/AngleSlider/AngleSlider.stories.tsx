import type { Meta, StoryObj } from '@storybook/react-vite';

import { AngleSlider } from './AngleSlider';

const meta = {
  title: 'Components/AngleSlider',
  component: AngleSlider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Gradient angle',
    tone: 'primary',
    defaultValue: 45,
    step: 1,
    showValue: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof AngleSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithMarks: Story = {
  args: { marks: [0, 45, 90, 135, 180, 225, 270, 315], step: 45 },
};
