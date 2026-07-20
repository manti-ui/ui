import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const variants = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'outline',
] as const;

const InfoIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 11v5M12 7.5v.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    variant: 'secondary',
    title: 'Dough is resting',
    children: 'Give it 30 minutes before you start rolling.',
    icon: InfoIcon,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 520 }}>
      {(['primary', 'secondary', 'tertiary', 'danger', 'outline'] as const).map((variant) => (
        <Alert
          {...args}
          key={variant}
          variant={variant}
          title={`${variant} message`}
        >
          A smooth status message with a calm icon.
        </Alert>
      ))}
    </div>
  ),
};

export const Dismissible: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    if (!open) {
      return <p style={{ color: 'var(--manti-text-muted)' }}>Dismissed.</p>;
    }
    return (
      <div style={{ maxWidth: 520 }}>
        <Alert {...args} onDismiss={() => setOpen(false)} />
      </div>
    );
  },
};
