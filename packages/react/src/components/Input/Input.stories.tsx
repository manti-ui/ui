import type { Story, StoryDefault } from '@ladle/react';

import { Input } from './Input.js';
import type { InputProps } from './Input.js';

export default {
  title: 'Components/Input',
  args: {
    label: 'Recipe name',
    placeholder: 'Kayseri mantısı',
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    variant: {
      control: { type: 'select' },
      options: ['default', 'fill'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  meta: { layout: 'centered' },
} satisfies StoryDefault<InputProps>;

export const Playground: Story<InputProps> = (args) => <Input {...args} />;

export const Filled: Story<InputProps> = (args) => <Input {...args} />;
Filled.args = { variant: 'fill', label: undefined, placeholder: 'Name' };

export const WithHint: Story<InputProps> = (args) => <Input {...args} />;
WithHint.args = { hint: 'Shown to everyone browsing the cookbook.' };

export const Invalid: Story<InputProps> = (args) => <Input {...args} />;
Invalid.args = {
  defaultValue: 'mantı',
  error: 'This recipe name is already taken.',
};

export const WithLeftAndRight: Story<InputProps> = (args) => (
  <Input {...args} />
);
WithLeftAndRight.args = {
  label: 'Servings',
  left: <span aria-hidden>−</span>,
  right: 'people',
  placeholder: '4',
  type: 'number',
};

export const Sizes: Story<InputProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <Input {...args} size="sm" label="Small" />
    <Input {...args} size="md" label="Medium" />
    <Input {...args} size="lg" label="Large" />
  </div>
);

export const Disabled: Story<InputProps> = (args) => <Input {...args} />;
Disabled.args = { defaultValue: 'Locked recipe', disabled: true };

export const RequiredWithoutMarker: Story<InputProps> = (args) => (
  <Input {...args} />
);
RequiredWithoutMarker.args = {
  required: true,
  requiredIndicator: null,
  hint: 'Native required semantics remain active.',
};

/**
 * `type="password"` adds a show/hide toggle and a Caps Lock warning. Turn Caps
 * Lock on while focused to see the notice.
 */
export const Password: Story<InputProps> = (args) => <Input {...args} />;
Password.args = {
  type: 'password',
  label: 'Password',
  placeholder: '••••••••',
  hint: 'Use at least 8 characters.',
  autoComplete: 'new-password',
};

export const PasswordInvalid: Story<InputProps> = (args) => <Input {...args} />;
PasswordInvalid.args = {
  type: 'password',
  label: 'Password',
  defaultValue: 'short',
  error: 'Password must be at least 8 characters.',
};

export const PasswordStartVisible: Story<InputProps> = (args) => (
  <Input {...args} />
);
PasswordStartVisible.args = {
  type: 'password',
  label: 'API secret',
  defaultValue: 'mantı-makes-forty-to-a-spoon',
  defaultPasswordVisible: true,
};

/** Opt out of the toggle when a secret should never be revealable on screen. */
export const PasswordWithoutToggle: Story<InputProps> = (args) => (
  <Input {...args} />
);
PasswordWithoutToggle.args = {
  type: 'password',
  label: 'Recovery code',
  defaultValue: 'mantı-mantı-mantı',
  showPasswordToggle: false,
};

/**
 * The password props are inert for every other type — the same way `min`/`max`
 * only apply to `type="number"`.
 */
export const Types: Story<InputProps> = (args) => (
  <div style={{ display: 'grid', gap: '1rem' }}>
    <Input {...args} type="text" label="Text" placeholder="Kayseri mantısı" />
    <Input {...args} type="email" label="Email" placeholder="mantı@wayv.dev" />
    <Input {...args} type="number" label="Servings" placeholder="4" />
    <Input {...args} type="password" label="Password" placeholder="••••••••" />
  </div>
);
