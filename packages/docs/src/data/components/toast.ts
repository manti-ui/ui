import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'toast',
  props: [
    {
      name: 'placement',
      type: `'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end'`,
      default: `'bottom-end'`,
      description: 'Corner the stack is anchored to (passed to createToaster).',
    },
    {
      name: 'overlap',
      type: 'boolean',
      default: 'true',
      description: 'Stack toasts on top of each other until hovered.',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum simultaneously visible toasts; extras queue.',
    },
    {
      name: 'gap',
      type: 'number',
      description: 'Gap between toasts, in px.',
    },
    {
      name: 'duration',
      type: 'number',
      description: 'Default visible duration, in ms.',
    },
    {
      name: 'swipe',
      type: 'boolean',
      default: 'true',
      description:
        'Allow dismissing a toast by swiping it toward its anchored edge.',
    },
  ],
  anatomy: [
    {
      part: 'group',
      description: 'The portal region that hosts the toast stack.',
    },
    {
      part: 'root',
      description: 'A single toast surface; carries the type tone.',
    },
    { part: 'indicator', description: 'The leading type icon.' },
    { part: 'title', description: 'The toast title.' },
    { part: 'description', description: 'The toast description.' },
    {
      part: 'close-trigger',
      description: 'The button that dismisses the toast.',
    },
    { part: 'action-trigger', description: 'An optional action button.' },
  ],
};
