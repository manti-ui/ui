import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'kbd',
  props: [
    {
      name: 'size',
      type: `'sm' | 'md'`,
      default: `'sm'`,
      description: 'Visual size of the key cap.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The semantic <kbd> element.',
    },
  ],
};
