import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'spinner',
  props: [
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Visual size.',
    },
    {
      name: 'label',
      type: 'string',
      default: `'Loading'`,
      description: 'Accessible label announced to assistive technology.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The spinning indicator; inherits currentColor.',
    },
  ],
};
