import type { Meta, StoryObj } from '@storybook/react-vite';

import { RatingGroup } from './RatingGroup';

const meta = {
  title: 'Components/RatingGroup',
  component: RatingGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Rate this recipe',
    count: 5,
    tone: 'warning',
    size: 'md',
    allowHalf: false,
    defaultValue: 3,
    readOnly: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof RatingGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const HalfStars: Story = {
  args: { allowHalf: true, defaultValue: 3.5 },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 4 },
};
