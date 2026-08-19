import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Garlic yogurt',
    size: 'md',
    defaultChecked: true,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
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
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--manti-space-3)' }}>
      {(['sm', 'md'] as const).map((size) => (
        <Switch {...args} key={size} size={size}>
          {size}
        </Switch>
      ))}
    </div>
  ),
};

export const AriaLabelOnly: Story = {
  args: {
    children: undefined,
    inputProps: { 'aria-label': 'Notifications' },
  },
};
