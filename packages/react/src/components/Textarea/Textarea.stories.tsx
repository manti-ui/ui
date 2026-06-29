import type { Meta, StoryObj } from '@storybook/react-vite';

import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Notes',
    placeholder: 'Add preparation notes',
    size: 'md',
    tone: 'primary',
    rows: 4,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    resize: { control: 'inline-radio', options: ['none', 'vertical'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'calc(var(--manti-space-16) * 6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDescription: Story = {
  args: {
    description: 'Shown below the field while there is no error.',
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 'Too short',
    error: 'Please add at least three sentences.',
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    maxHeight: 'calc(var(--manti-space-16) * 2)',
    defaultValue:
      'This textarea grows with content until it reaches its maximum height.',
  },
};

export const ResizeNone: Story = {
  args: {
    resize: 'none',
    defaultValue: 'Manual resizing is disabled for this field.',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
      <Textarea {...args} size="sm" label="Small" />
      <Textarea {...args} size="md" label="Medium" />
      <Textarea {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: 'Locked notes', disabled: true },
};
