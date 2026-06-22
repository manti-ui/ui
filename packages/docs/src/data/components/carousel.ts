import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'carousel',
  props: [
    {
      name: 'slides',
      type: 'ReactNode[]',
      description: 'The slides to render, one entry per slide.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone of the active page indicator.',
    },
    {
      name: 'slidesPerPage',
      type: 'number',
      default: '1',
      description: 'Number of slides visible per page.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Layout direction.',
    },
    {
      name: 'mouseDrag',
      type: 'boolean',
      default: 'true',
      description: 'Allow swiping between slides by dragging with the mouse.',
    },
    {
      name: 'loop',
      type: 'boolean',
      description: 'Wrap from the last slide back to the first.',
    },
    {
      name: 'page',
      type: 'number',
      description: 'Controlled active page.',
    },
    {
      name: 'defaultPage',
      type: 'number',
      description: 'Initial active page for uncontrolled usage.',
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Called whenever the active page changes.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The wrapper around the viewport and controls.',
    },
    {
      part: 'item-group',
      description: 'The scroll-snapping track holding the slides.',
    },
    { part: 'item', description: 'A single slide.' },
    {
      part: 'control',
      description: 'The bar holding the arrows and indicators.',
    },
    {
      part: 'prev-trigger',
      description: 'The button that steps to the previous page.',
    },
    {
      part: 'next-trigger',
      description: 'The button that steps to the next page.',
    },
    {
      part: 'indicator-group',
      description: 'The group of page-position dots.',
    },
    { part: 'indicator', description: 'A single page indicator dot.' },
  ],
};
