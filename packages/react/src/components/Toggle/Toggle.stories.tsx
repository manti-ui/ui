import { useState } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Toggle } from './Toggle.js';
import type { ToggleProps } from './Toggle.js';

export default {
  title: 'Components/Toggle',
  args: { variant: 'primary', defaultPressed: false, disabled: false },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<ToggleProps>;

export const Playground: Story<ToggleProps> = (args) => <Toggle {...args} />;
Playground.args = { children: 'Spicy' };

export const IconOnly: Story<ToggleProps> = (args) => <Toggle {...args} />;
IconOnly.args = {
  iconOnly: true,
  'aria-label': 'Toggle bold',
  children: <strong>B</strong>,
};

export const Controlled: Story<ToggleProps> = (args) => {
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
};

export const RenderProp: Story<ToggleProps> = (args) => <Toggle {...args} />;
RenderProp.args = {
  children: (pressed: boolean) => (pressed ? '🔔 On' : '🔕 Off'),
};
