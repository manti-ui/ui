import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'hover-card',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        'Element that reveals the card on hover or focus. Cloned with the machine trigger props.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The card content.',
    },
    {
      name: 'placement',
      type: `'top' | 'bottom' | 'left' | 'right' | '…-start' | '…-end'`,
      default: `'bottom'`,
      description: 'Placement of the card relative to the trigger.',
    },
    {
      name: 'showArrow',
      type: 'boolean',
      default: 'true',
      description: 'Render the arrow pointing at the trigger.',
    },
    {
      name: 'openDelay',
      type: 'number',
      description: 'Delay before opening, in milliseconds.',
    },
    {
      name: 'closeDelay',
      type: 'number',
      description: 'Delay before closing, in milliseconds.',
    },
    {
      name: 'open',
      type: 'boolean',
      description: 'Controlled open state.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: 'Initial open state for uncontrolled usage.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: 'Called whenever the open state changes.',
    },
  ],
  anatomy: [
    {
      part: 'positioner',
      description:
        'Floating wrapper that positions the card against the trigger.',
    },
    {
      part: 'content',
      description: 'The frosted preview panel.',
    },
    {
      part: 'arrow',
      description: 'Arrow pointing back at the trigger.',
    },
  ],
};
