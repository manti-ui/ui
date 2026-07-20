import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Extra sumac',
    size: 'md',
    variant: 'primary',
    defaultChecked: true,
    indeterminate: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <Checkbox {...args} defaultChecked={false}>
        Unchecked
      </Checkbox>
      <Checkbox {...args} defaultChecked>
        Checked
      </Checkbox>
      <Checkbox {...args} indeterminate>
        Indeterminate
      </Checkbox>
      <Checkbox {...args} defaultChecked={false} disabled>
        Disabled
      </Checkbox>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Checkbox {...args} size="sm">
        Small
      </Checkbox>
      <Checkbox {...args} size="md">
        Medium
      </Checkbox>
      <Checkbox {...args} size="lg">
        Large
      </Checkbox>
    </div>
  ),
};
