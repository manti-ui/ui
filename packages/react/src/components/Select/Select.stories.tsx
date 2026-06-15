import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from './Select';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
  { value: 'sarajevo', label: 'Sarajevo' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items: regions,
    label: 'Region',
    placeholder: 'Pick a region…',
    tone: 'primary',
    size: 'md',
    multiple: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
    label: 'Regions',
    defaultValue: ['kayseri', 'kashgar'],
  },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', width: 260 }}>
      <Select {...args} label="Default" />
      <Select {...args} label="Invalid" invalid />
      <Select {...args} label="Disabled" disabled />
    </div>
  ),
};
