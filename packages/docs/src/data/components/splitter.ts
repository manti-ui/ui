import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'splitter',
  props: [
    {
      name: 'panels',
      type: 'SplitterPanel[]',
      description:
        'The resizable panels, in order. Each: { id, content, minSize?, maxSize?, collapsible? }.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Layout direction of the split.',
    },
    {
      name: 'size',
      type: 'number[]',
      description: 'Controlled panel sizes, as percentages.',
    },
    {
      name: 'defaultSize',
      type: 'number[]',
      description: 'Initial panel sizes for uncontrolled usage.',
    },
    {
      name: 'onResize',
      type: '(size: number[]) => void',
      description: 'Called while resizing, with the new sizes.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The split-layout container.' },
    { part: 'panel', description: 'A single resizable region.' },
    {
      part: 'resize-trigger',
      description: 'The draggable divider between panels.',
    },
  ],
};
