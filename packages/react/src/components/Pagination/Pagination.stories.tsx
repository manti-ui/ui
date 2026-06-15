import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    count: 200,
    pageSize: 20,
    defaultPage: 3,
    siblingCount: 1,
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
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FewPages: Story = {
  args: { count: 60, pageSize: 20, defaultPage: 1 },
};

export const ManyPages: Story = {
  args: { count: 1000, pageSize: 20, defaultPage: 12, siblingCount: 2 },
};
