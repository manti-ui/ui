import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

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
    tone: 'info',
    variant: 'soft',
    title: 'Dough is resting',
    children: 'Give it 30 minutes before you start rolling.',
    icon: InfoIcon,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    variant: { control: 'inline-radio', options: ['soft', 'solid'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 520 }}>
      {(['success', 'warning', 'danger', 'info'] as const).map((tone) => (
        <Alert {...args} key={tone} tone={tone} title={`${tone} message`}>
          A smooth, tonal status message with a calm icon.
        </Alert>
      ))}
    </div>
  ),
};

export const Solid: Story = {
  args: { variant: 'solid', tone: 'success' },
  render: (args) => <div style={{ maxWidth: 520 }}>{<Alert {...args} />}</div>,
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
