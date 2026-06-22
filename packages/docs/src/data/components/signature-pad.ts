import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'signature-pad',
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Optional label rendered above the drawing surface.',
    },
    {
      name: 'clearLabel',
      type: 'ReactNode',
      default: `'Clear'`,
      description: 'Label for the clear button.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Accent tone of the surface and stroke.',
    },
    {
      name: 'paths',
      type: 'string[]',
      description: 'Controlled stroke paths.',
    },
    {
      name: 'defaultPaths',
      type: 'string[]',
      description: 'Initial stroke paths for uncontrolled usage.',
    },
    {
      name: 'onDrawEnd',
      type: '(paths: string[]) => void',
      description: 'Called when a stroke ends, with all paths.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable drawing.',
    },
    {
      name: 'readOnly',
      type: 'boolean',
      description: 'Render the strokes without allowing new input.',
    },
    {
      name: 'name',
      type: 'string',
      description: 'Form field name for the encoded signature.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The component container.' },
    { part: 'label', description: 'The optional label.' },
    { part: 'control', description: 'The drawing frame.' },
    { part: 'segment', description: 'The SVG canvas holding the strokes.' },
    { part: 'segment-path', description: 'A single drawn stroke path.' },
    { part: 'guide', description: 'The dashed sign-here baseline.' },
    { part: 'clear-trigger', description: 'The clear button.' },
  ],
};
