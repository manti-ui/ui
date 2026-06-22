import type { Meta, StoryObj } from '@storybook/react-vite';

import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Password',
    placeholder: '••••••••',
    size: 'md',
    tone: 'primary',
    fullWidth: false,
    showVisibilityToggle: true,
    showCapsLockWarning: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'inline-radio',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '20rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    hint: 'Use at least 8 characters. Try toggling Caps Lock to see the warning.',
    autoComplete: 'new-password',
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'short',
    error: 'Password must be at least 8 characters.',
  },
};

export const StartVisible: Story = {
  args: {
    label: 'API secret',
    defaultValue: 'mantı-makes-forty-to-a-spoon',
    defaultVisible: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <PasswordInput size="sm" label="Small" placeholder="Small" />
      <PasswordInput size="md" label="Medium" placeholder="Medium" />
      <PasswordInput size="lg" label="Large" placeholder="Large" />
    </div>
  ),
};
