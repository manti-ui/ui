import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Recipe name',
    placeholder: 'Kayseri mantısı',
    size: 'md',
    tone: 'primary',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHint: Story = {
  args: { hint: 'Shown to everyone browsing the cookbook.' },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'mantı',
    error: 'This recipe name is already taken.',
  },
};

export const WithAddons: Story = {
  args: {
    label: 'Servings',
    leadingAddon: <span aria-hidden>🍽️</span>,
    trailingAddon: <span style={{ fontSize: 13 }}>people</span>,
    placeholder: '4',
    type: 'number',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: 'Locked recipe', disabled: true },
};

/**
 * `type="password"` adds a show/hide toggle and a Caps Lock warning. Turn Caps
 * Lock on while focused to see the notice.
 */
export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    hint: 'Use at least 8 characters.',
    autoComplete: 'new-password',
  },
};

export const PasswordInvalid: Story = {
  args: {
    type: 'password',
    label: 'Password',
    defaultValue: 'short',
    error: 'Password must be at least 8 characters.',
  },
};

export const PasswordStartVisible: Story = {
  args: {
    type: 'password',
    label: 'API secret',
    defaultValue: 'mantı-makes-forty-to-a-spoon',
    defaultPasswordVisible: true,
  },
};

/** Opt out of the toggle when a secret should never be revealable on screen. */
export const PasswordWithoutToggle: Story = {
  args: {
    type: 'password',
    label: 'Recovery code',
    defaultValue: 'mantı-mantı-mantı',
    showPasswordToggle: false,
  },
};

/**
 * The password props are inert for every other type — the same way `min`/`max`
 * only apply to `type="number"`.
 */
export const Types: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Input {...args} type="text" label="Text" placeholder="Kayseri mantısı" />
      <Input
        {...args}
        type="email"
        label="Email"
        placeholder="mantı@wayv.dev"
      />
      <Input {...args} type="number" label="Servings" placeholder="4" />
      <Input
        {...args}
        type="password"
        label="Password"
        placeholder="••••••••"
      />
    </div>
  ),
};
