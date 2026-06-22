import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'avatar',
  props: [
    {
      name: 'src',
      type: 'string',
      description:
        'Image source. Falls back to children when it fails to load.',
    },
    {
      name: 'alt',
      type: 'string',
      default: `''`,
      description: 'Alt text for the image.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Fallback content — typically initials.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg' | 'xl'`,
      default: `'md'`,
      description: 'Visual size.',
    },
    {
      name: 'shape',
      type: `'circle' | 'square'`,
      default: `'circle'`,
      description: 'Outline shape.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The element clipping the image to its shape.',
    },
    {
      part: 'image',
      description: 'The loaded image, shown when `src` resolves.',
    },
    {
      part: 'fallback',
      description: 'The initials/children shown while loading or on failure.',
    },
  ],
};
