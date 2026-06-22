import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'pagination',
  props: [
    {
      name: 'count',
      type: 'number',
      description: 'Total number of items across all pages.',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: 'Items per page.',
    },
    {
      name: 'page',
      type: 'number',
      description: 'Controlled current page (1-based).',
    },
    {
      name: 'defaultPage',
      type: 'number',
      description: 'Initial page for uncontrolled usage.',
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Called whenever the page changes.',
    },
    {
      name: 'siblingCount',
      type: 'number',
      description: 'Pages shown on each side of the current page.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control size.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone applied to the active page.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The `<nav>` wrapper carrying scope, size, and tone.',
    },
    {
      part: 'prev-trigger',
      description: 'Button that moves to the previous page.',
    },
    {
      part: 'next-trigger',
      description: 'Button that moves to the next page.',
    },
    {
      part: 'item',
      description:
        'A single page button; the active one carries `data-selected`.',
    },
    {
      part: 'ellipsis',
      description: 'The gap marker shown when pages are collapsed.',
    },
  ],
};
