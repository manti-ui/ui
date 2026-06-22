import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'drawer',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description: 'Element cloned with the open trigger props.',
    },
    {
      name: 'placement',
      type: `'left' | 'right' | 'top' | 'bottom'`,
      default: `'right'`,
      description: 'Edge the drawer slides in from.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Extent along the panel axis (width for left/right, height for top/bottom).',
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Heading shown at the top.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Supporting copy under the title.',
    },
    {
      name: 'children',
      type: 'ReactNode | (({ close }) => ReactNode)',
      description: 'Body; accepts a render function receiving { close }.',
    },
    {
      name: 'footer',
      type: 'ReactNode | (({ close }) => ReactNode)',
      description: 'Footer actions; also receives { close }.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: 'true',
      description: 'Show the corner close button.',
    },
    {
      name: 'open / defaultOpen',
      type: 'boolean',
      description: 'Controlled / uncontrolled open state.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called whenever the open state changes.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: 'true',
      description: 'Trap pointer interaction and hide content below.',
    },
    {
      name: 'closeOnInteractOutside / closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Dismiss on outside click / Escape.',
    },
  ],
  anatomy: [
    { part: 'trigger', description: 'The cloned opener element.' },
    { part: 'backdrop', description: 'The dimmed scrim.' },
    { part: 'positioner', description: 'Anchors the content to the edge.' },
    { part: 'content', description: 'The translucent sliding panel.' },
    { part: 'title', description: 'The heading.' },
    { part: 'description', description: 'Supporting copy.' },
    { part: 'body', description: 'The main content region.' },
    { part: 'footer', description: 'The actions region.' },
    { part: 'close-trigger', description: 'The corner close button.' },
  ],
};
