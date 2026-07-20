import type { Meta, StoryObj } from '@storybook/react-vite';

import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Servings',
    size: 'md',
    variant: 'primary',
    defaultValue: '12',
    min: 0,
    max: 99,
    step: 1,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <NumberInput {...args} size="sm" label="Small" />
      <NumberInput {...args} size="md" label="Medium" />
      <NumberInput {...args} size="lg" label="Large" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <NumberInput {...args} label="Default" />
      <NumberInput {...args} label="Invalid" invalid />
      <NumberInput {...args} label="Disabled" disabled />
    </div>
  ),
};
