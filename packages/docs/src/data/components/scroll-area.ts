import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'scroll-area',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The content to scroll.',
    },
    {
      name: 'orientation',
      type: `'vertical' | 'horizontal' | 'both'`,
      default: `'vertical'`,
      description: 'Which axis scrolls.',
    },
    {
      name: 'type',
      type: `'auto' | 'hover' | 'always'`,
      default: `'auto'`,
      description: 'When the thumb shows: on activity then idle-hide (auto), on hover/focus/drag (hover), or whenever content overflows (always).',
    },
    {
      name: 'focusable',
      type: 'boolean',
      default: 'true',
      description: 'Make the viewport keyboard-focusable so it can be scrolled.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The bounded outer container.' },
    { part: 'viewport', description: 'The scrollable element (native scrollbar hidden).' },
    { part: 'content', description: 'The inner content wrapper.' },
    { part: 'scrollbar', description: 'A custom scrollbar track (one per scrolling axis).' },
    { part: 'thumb', description: 'The draggable thumb inside a scrollbar.' },
  ],
};
