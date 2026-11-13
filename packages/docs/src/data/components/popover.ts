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
    {
      name: 'width',
      type: "CSSProperties['width']",
      default: `'max-content'`,
      description:
        'Panel width, written to `--manti-popover-width` on the content part. A length set without `maxWidth` also lifts the default `20rem` cap to itself (still clamped to the viewport); a keyword such as `fit-content` keeps the default cap.',
    },
    {
      name: 'maxWidth',
      type: "CSSProperties['maxWidth']",
      default: `'20rem'`,
      description:
        'Largest panel width, written to `--manti-popover-max-width` on the content part. The panel never grows past the viewport less its gutter.',
    },
    {
      name: 'contentProps',
      type: "Omit<HTMLAttributes<HTMLDivElement>, 'children'>",
      description:
        "Attributes merged onto the content part. The machine's props win; `className` and `style` compose with `className`, `width` and `maxWidth`.",
    },
  ],
  anatomy: [
    {
      part: 'positioner',
      description: 'The portalled wrapper that positions the panel.',
    },
    { part: 'content', description: 'The translucent floating panel.' },
    { part: 'title', description: 'The optional heading.' },
    { part: 'description', description: 'The panel body content.' },
    { part: 'close-trigger', description: 'The optional corner close button.' },
  ],
};
