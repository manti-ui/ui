import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items: [
      { value: 'boiled', label: 'Boiled' },
      { value: 'steamed', label: 'Steamed' },
      { value: 'fried', label: 'Fried' },
    ],
    defaultValue: 'boiled',
    size: 'md',
    tone: 'primary',
    orientation: 'horizontal',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    tone: {
      control: 'inline-radio',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SegmentedControl
          key={size}
          size={size}
          defaultValue="grid"
          items={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
            { value: 'board', label: 'Board' },
          ]}
        />
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultValue: 'steamed',
  },
};

export const WithDisabledSegment: Story = {
  args: {
    defaultValue: 'boiled',
    items: [
      { value: 'boiled', label: 'Boiled' },
      { value: 'steamed', label: 'Steamed' },
      { value: 'fried', label: 'Fried', disabled: true },
    ],
  },
};
