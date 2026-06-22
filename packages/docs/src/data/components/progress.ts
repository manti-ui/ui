import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'progress',
  props: [
    {
      name: 'variant',
      type: `'linear' | 'circular'`,
      default: `'linear'`,
      description: 'Linear bar or circular ring.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Fill tone.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Control size.',
    },
    {
      name: 'value',
      type: 'number | null',
      description: 'Controlled value; pass `null` for an indeterminate state.',
    },
    {
      name: 'defaultValue',
      type: 'number | null',
      description: 'Initial value for uncontrolled usage.',
    },
    {
      name: 'min',
      type: 'number',
      default: '0',
      description: 'Minimum value.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Maximum value.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      description: 'Show the formatted value text.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The indicator wrapper.' },
    {
      part: 'header',
      description: 'Row holding the label and value text.',
    },
    { part: 'label', description: 'The optional label.' },
    { part: 'value-text', description: 'The formatted value text.' },
    { part: 'track', description: 'The linear track behind the fill.' },
    { part: 'range', description: 'The filled portion of the linear track.' },
    { part: 'circle', description: 'The circular SVG ring.' },
    { part: 'circle-track', description: 'The circular ring background.' },
    { part: 'circle-range', description: 'The filled arc of the ring.' },
    {
      part: 'circle-text',
      description: 'The percentage shown inside the ring.',
    },
  ],
};
