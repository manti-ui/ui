import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { variant: 'primary', defaultPressed: false, disabled: false },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: 'Spicy' },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    'aria-label': 'Toggle bold',
    children: <strong>B</strong>,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [pressed, setPressed] = useState(true);
    return (
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Toggle {...args} pressed={pressed} onPressedChange={setPressed}>
          Notifications
        </Toggle>
        <span style={{ color: 'var(--manti-text-muted)' }}>
          {pressed ? 'on' : 'off'}
        </span>
      </div>
    );
  },
};

export const RenderProp: Story = {
  args: {
    children: (pressed: boolean) => (pressed ? '🔔 On' : '🔕 Off'),
  },
};
