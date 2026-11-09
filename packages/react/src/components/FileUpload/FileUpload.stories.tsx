import type { Story, StoryDefault } from '@ladle/react';

import { FileUpload } from './FileUpload.js';
import type { FileUploadProps } from './FileUpload.js';

export default {
  title: 'Components/FileUpload',
  args: {
    label: 'Attachments',
    variant: 'primary',
    maxFiles: 5,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<FileUploadProps>;

export const Playground: Story<FileUploadProps> = (args) => (
  <FileUpload {...args} />
);

export const ImagesOnly: Story<FileUploadProps> = (args) => (
  <FileUpload {...args} />
);
ImagesOnly.args = { label: 'Photos', accept: 'image/*', maxFiles: 3 };
