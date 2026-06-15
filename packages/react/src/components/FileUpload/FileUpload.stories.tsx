import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileUpload } from './FileUpload';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Attachments',
    tone: 'primary',
    maxFiles: 5,
    disabled: false,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ImagesOnly: Story = {
  args: { label: 'Photos', accept: 'image/*', maxFiles: 3 },
};
