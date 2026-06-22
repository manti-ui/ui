import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'marquee',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Content to scroll. It is duplicated to make the loop seamless.',
    },
    {
      name: 'direction',
      type: `'left' | 'right' | 'up' | 'down'`,
      default: `'left'`,
      description:
        'Scroll direction. Vertical (`up`/`down`) needs the root to have a height.',
    },
    {
      name: 'speed',
      type: 'number',
      default: '20',
      description: 'Seconds for one full loop. Higher is slower.',
    },
    {
      name: 'pauseOnHover',
      type: 'boolean',
      default: 'true',
      description: 'Pause the scroll while the pointer is over it.',
    },
    {
      name: 'gap',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Spacing between the repeated content.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description:
        'The clipping wrapper carrying direction, gap, and pause state.',
    },
    {
      part: 'content',
      description:
        'The translating track that holds both copies of the content.',
    },
    {
      part: 'group',
      description:
        'One copy of the content; the second copy is hidden from assistive tech.',
    },
  ],
};
