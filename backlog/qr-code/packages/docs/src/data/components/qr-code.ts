import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'qr-code',
  props: [
    {
      name: 'value',
      type: 'string',
      description: 'The encoded value.',
    },
    {
      name: 'size',
      type: 'number',
      default: '160',
      description: 'Control size in pixels.',
    },
    {
      name: 'overlay',
      type: 'ReactNode',
      description: 'Optional overlay (e.g. a logo) centered on the code.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The square wrapper.' },
    { part: 'frame', description: 'The SVG frame holding the code.' },
    { part: 'pattern', description: 'The rendered QR pattern path.' },
    {
      part: 'overlay',
      description: 'The optional element centered over the code.',
    },
  ],
};
