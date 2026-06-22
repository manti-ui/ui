import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'collapsible',
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      description: 'The content of the toggle button.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The collapsible content revealed when open.',
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
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the trigger.',
    },
  ],
  anatomy: [
    {
      part: 'root',
      description: 'The wrapper around the trigger and content.',
    },
    { part: 'trigger', description: 'The button that toggles the disclosure.' },
    {
      part: 'content',
      description: 'The region that animates its height open and closed.',
    },
  ],
};
