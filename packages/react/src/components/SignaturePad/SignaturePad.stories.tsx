import type { Meta, StoryObj } from '@storybook/react-vite';

import { SignaturePad } from './SignaturePad';

const meta = {
  title: 'Components/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Sign here',
    variant: 'primary',
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
