import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'text',
  props: [
    {
      name: 'as',
      type: 'ElementType',
      default: `'p'`,
      description: 'Element to render. The styling is unchanged.',
    },
    {
      name: 'size',
      type: `TextScale | \`\${TextScale}/\${TextWeight}\``,
      default: `'base'`,
      description:
        'Type-scale stop, optionally with a weight after a slash: "lg" or "lg/semibold". Omitting the weight keeps whatever the stylesheet decides for that stop.',
    },
    {
      name: 'emphasis',
      type: `'default' | 'muted' | 'subtle'`,
      default: `'default'`,
      description:
        'Neutral emphasis ladder: body copy, supporting detail, or metadata.',
    },
    {
      name: 'variant',
      type: 'MantiVariant',
      description: 'Semantic color. Wins over emphasis when both are set.',
    },
    {
      name: 'align',
      type: `'start' | 'center' | 'end' | 'justify'`,
      description: 'Text alignment.',
    },
    {
      name: 'truncate',
      type: 'boolean',
      default: 'false',
      description:
        'Clamp to a single line with an ellipsis. Ignored when lineClamp is set.',
    },
    {
      name: 'lineClamp',
      type: 'number',
      description: 'Clamp to this many lines with an ellipsis.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description:
        'The rendered text element (a <p> unless `as` says otherwise).',
    },
  ],
};
