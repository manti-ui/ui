import type { Meta, StoryObj } from '@storybook/react-vite';

import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Spice level',
    tone: 'primary',
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    disabled: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  args: { label: 'Price range', defaultValue: [25, 75] },
};

export const WithMarks: Story = {
  args: { label: 'Portion', marks: [0, 25, 50, 75, 100] },
};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: 360 }}>
      {(['primary', 'success', 'warning', 'danger', 'info'] as const).map(
        (tone) => (
          <Slider {...args} key={tone} tone={tone} label={tone} />
        ),
      )}
    </div>
  ),
};
