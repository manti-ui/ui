import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'popover',
  props: [
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        "Element that toggles the popover. Cloned with the machine's trigger props.",
    },
    {
      name: 'title',
      type: 'ReactNode',
      description: 'Optional heading rendered at the top of the panel.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Panel content.',
    },
    {
      name: 'placement',
      type: 'Placement',
      default: `'bottom'`,
      description: 'Placement relative to the trigger.',
    },
    {
      name: 'showArrow',
      type: 'boolean',
      default: 'true',
      description: 'Render the arrow pointing at the trigger.',
    },
    {
      name: 'showCloseButton',
      type: 'boolean',
      default: 'false',
      description: 'Show the corner close button.',
    },
    {
      name: 'modal',
      type: 'boolean',
      description:
        'Make the popover modal (trap focus, block outside interaction).',
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
      name: 'closeOnInteractOutside',
      type: 'boolean',
      default: 'true',
      description: 'Close when clicking outside the content.',
    },
    {
      name: 'closeOnEscape',
      type: 'boolean',
      default: 'true',
      description: 'Close when pressing Escape.',
    },
  ],
  anatomy: [
    {
      part: 'positioner',
      description: 'The portalled wrapper that positions the panel.',
    },
    { part: 'content', description: 'The frosted floating panel.' },
    { part: 'arrow', description: 'The arrow pointing at the trigger.' },
    { part: 'title', description: 'The optional heading.' },
    { part: 'description', description: 'The panel body content.' },
    { part: 'close-trigger', description: 'The optional corner close button.' },
  ],
};
