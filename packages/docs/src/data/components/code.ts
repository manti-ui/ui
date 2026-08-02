import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'code',
  props: [
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'sm'`,
      description: 'Visual size of the inline code.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The semantic inline <code> element.',
    },
  ],
};
