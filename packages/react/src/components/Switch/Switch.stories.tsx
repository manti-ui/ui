import type { Story, StoryDefault } from '@ladle/react';

import { Switch } from './Switch.js';
import type { SwitchProps } from './Switch.js';

export default {
  title: 'Components/Switch',
  args: {
    children: 'Garlic yogurt',
    size: 'md',
    defaultChecked: true,
    disabled: false,
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md'] },
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<SwitchProps>;

export const Playground: Story<SwitchProps> = (args) => <Switch {...args} />;

export const States: Story<SwitchProps> = (args) => (
  <div style={{ display: 'grid', gap: 'var(--manti-space-3)' }}>
    <Switch {...args} defaultChecked={false}>
      Off
    </Switch>
    <Switch {...args} defaultChecked>
      On
    </Switch>
    <Switch {...args} defaultChecked={false} disabled>
      Disabled
    </Switch>
    <Switch {...args} defaultChecked disabled>
      Disabled, on
    </Switch>
  </div>
);

export const Sizes: Story<SwitchProps> = (args) => (
  <div style={{ display: 'grid', gap: 'var(--manti-space-3)' }}>
    {(['sm', 'md'] as const).map((size) => (
      <Switch {...args} key={size} size={size}>
        {size}
      </Switch>
    ))}
  </div>
);

export const AriaLabelOnly: Story<SwitchProps> = (args) => <Switch {...args} />;
AriaLabelOnly.args = {
  children: undefined,
  inputProps: { 'aria-label': 'Notifications' },
};
