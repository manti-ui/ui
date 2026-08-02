import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'blockquote',
  props: [
    {
      name: 'size',
      type: `'md' | 'lg'`,
      default: `'md'`,
      description: 'Visual size of the quoted text.',
    },
    {
      name: 'cite',
      type: 'string',
      description:
        'Native source URL for the quotation. This metadata is not rendered as visible attribution.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The semantic <blockquote> element.',
    },
  ],
};
