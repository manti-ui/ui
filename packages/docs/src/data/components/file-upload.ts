import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'file-upload',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label.',
    },
    {
      name: 'hint',
      type: 'ReactNode',
      default: `'Drag files here or browse'`,
      description: 'Dropzone hint text.',
    },
    {
      name: 'triggerLabel',
      type: 'ReactNode',
      default: `'Browse files'`,
      description: 'Browse-button label.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Accent tone.',
    },
    {
      name: 'accept',
      type: 'string | string[]',
      description: 'Accepted MIME types / extensions.',
    },
    {
      name: 'maxFiles',
      type: 'number',
      description: 'Maximum number of files.',
    },
    {
      name: 'maxFileSize',
      type: 'number',
      description: 'Maximum size per file, in bytes.',
    },
    {
      name: 'onFilesChange',
      type: '(files: File[]) => void',
      description: 'Called whenever the accepted file list changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the dropzone.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The wrapper; carries data-tone.' },
    { part: 'label', description: 'The label.' },
    { part: 'dropzone', description: 'The drag-and-drop target.' },
    {
      part: 'trigger',
      description: 'The browse button that opens the file picker.',
    },
    { part: 'item-group', description: 'The list of accepted files.' },
    { part: 'item', description: 'A single accepted file row.' },
    { part: 'item-name', description: 'The file name.' },
    { part: 'item-size-text', description: 'The formatted file size.' },
    {
      part: 'item-delete-trigger',
      description: 'Removes a file from the list.',
    },
  ],
};
