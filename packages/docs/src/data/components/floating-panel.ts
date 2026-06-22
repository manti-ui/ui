import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'floating-panel',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        'Element that opens the panel. Cloned with the machine trigger props.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Panel title shown in the header.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Panel body.',
    },
    {
      name: 'draggable',
      type: 'boolean',
      default: 'true',
      description: 'Allow dragging by the header.',
    },
    {
      name: 'resizable',
      type: 'boolean',
      default: 'true',
      description: 'Allow edge/corner resizing.',
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
    { part: 'positioner', description: 'Positions the floating panel.' },
    { part: 'content', description: 'The translucent panel surface.' },
    { part: 'header', description: 'The title bar, also the drag handle.' },
    {
      part: 'drag-trigger',
      description: 'The draggable region of the header.',
    },
    { part: 'title', description: 'The panel title text.' },
    { part: 'control', description: 'Wraps the stage and close buttons.' },
    {
      part: 'stage-trigger',
      description: 'Minimize, maximize, or restore the panel.',
    },
    { part: 'close-trigger', description: 'Closes the panel.' },
    { part: 'body', description: 'The scrollable panel content.' },
    { part: 'resize-trigger', description: 'An edge or corner resize handle.' },
  ],
};
