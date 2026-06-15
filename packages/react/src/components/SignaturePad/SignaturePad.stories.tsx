import type { Meta, StoryObj } from '@storybook/react-vite';

import { SignaturePad } from './SignaturePad';

const meta = {
  title: 'Components/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Sign here',
    tone: 'primary',
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
