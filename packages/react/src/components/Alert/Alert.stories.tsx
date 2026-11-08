import { useState } from 'react';
import type { Story, StoryDefault } from '@ladle/react';
import { Alert } from './Alert.js';
import type { AlertProps } from './Alert.js';
import { Button } from '../Button/Button.js';
import { Text } from '../Text/Text.js';

const variants = ['primary', 'secondary', 'success', 'info', 'danger'] as const;

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

export default {
  title: 'Components/Alert',
  args: {
    variant: 'secondary',
    title: 'Dough is resting',
    children: 'Give it 30 minutes before you start rolling.',
    icon: InfoIcon,
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: variants },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<AlertProps>;

export const Playground: Story<AlertProps> = (args) => <Alert {...args} />;

export const Variants: Story<AlertProps> = (args) => (
  <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 520 }}>
    {variants.map((variant) => (
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
);

export const Dismissible: Story<AlertProps> = (args) => {
  const [open, setOpen] = useState(true);
  if (!open) {
    return <Text emphasis="muted">Dismissed.</Text>;
  }
  return (
    <div style={{ maxWidth: 520 }}>
      <Alert {...args} onDismiss={() => setOpen(false)} />
    </div>
  );
};

export const WithActions: Story<AlertProps> = (args) => <Alert {...args} />;
WithActions.args = {
  title: 'Restore draft?',
  actions: (
    <>
      <Button size="sm">Restore</Button>
      <Button size="sm" variant="tertiary">
        Discard
      </Button>
    </>
  ),
};
