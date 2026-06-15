import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleGroup } from './ToggleGroup';

const alignItems = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items: alignItems,
    size: 'md',
    tone: 'primary',
    multiple: false,
    defaultValue: ['center'],
    orientation: 'horizontal',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['left', 'right'],
    items: [
      { value: 'bold', label: 'B' },
      { value: 'italic', label: 'I' },
      { value: 'underline', label: 'U' },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <ToggleGroup {...args} size="sm" />
      <ToggleGroup {...args} size="md" />
      <ToggleGroup {...args} size="lg" />
    </div>
  ),
};
