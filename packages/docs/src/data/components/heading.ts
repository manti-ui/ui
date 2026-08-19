import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'heading',
  props: [
    {
      name: 'level',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      default: '2',
      description:
        'Semantic heading rank. Picks the h1-h6 element and the default size.',
    },
    {
      name: 'size',
      type: `TextScale | \`\${TextScale}/\${TextWeight}\``,
      description:
        'Type-scale stop, optionally with a weight: "4xl" or "4xl/regular". Defaults to the stop implied by level, so rank and visual size stay independent.',
    },
    {
      name: 'as',
      type: 'ElementType',
      description:
        'Override the rendered element, keeping the heading treatment.',
    },
    {
      name: 'emphasis',
      type: `'default' | 'muted' | 'subtle'`,
      default: `'default'`,
      description: 'Neutral emphasis ladder.',
    },
    {
      name: 'variant',
      type: 'MantiVariant',
      description: 'Semantic color. Wins over emphasis when both are set.',
    },
    {
      name: 'align',
      type: `'start' | 'center' | 'end'`,
      description: 'Text alignment.',
    },
    {
      name: 'truncate',
      type: 'boolean',
      default: 'false',
      description: 'Clamp to a single line with an ellipsis.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The rendered heading element.',
    },
  ],
};
