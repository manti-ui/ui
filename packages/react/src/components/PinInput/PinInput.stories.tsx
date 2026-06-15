import type { Meta, StoryObj } from '@storybook/react-vite';

import { PinInput } from './PinInput';

const meta = {
  title: 'Components/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'One-time code',
    length: 4,
    size: 'md',
    tone: 'primary',
    type: 'numeric',
    otp: true,
    mask: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: {
      control: 'inline-radio',
      options: ['numeric', 'alphanumeric', 'alphabetic'],
    },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SixDigits: Story = {
  args: { length: 6, label: 'Verification code' },
};

export const Masked: Story = {
  args: { mask: true, label: 'PIN' },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PinInput {...args} label="Default" />
      <PinInput {...args} label="Invalid" invalid />
      <PinInput {...args} label="Disabled" disabled />
    </div>
  ),
};
