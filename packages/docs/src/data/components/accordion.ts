import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'accordion',
  props: [
    {
      name: 'items',
      type: 'AccordionItem[]',
      description:
        'The disclosure items. Each is `{ value, title, content, disabled? }`.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Allow multiple panels open at once.',
    },
    {
      name: 'collapsible',
      type: 'boolean',
      default: 'true',
      description: 'Allow closing the open panel in single mode.',
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'Controlled set of open values.',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      description: 'Initial open values for uncontrolled usage.',
    },
    {
      name: 'onValueChange',
      type: '(value: string[]) => void',
      description: 'Called whenever the open set changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the whole accordion.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The stack wrapping every disclosure item.' },
    {
      part: 'item',
      description: 'A single disclosure (trigger plus content).',
    },
    {
      part: 'item-trigger',
      description: 'The header button that toggles the panel.',
    },
    {
      part: 'item-indicator',
      description: 'The chevron that rotates with the open state.',
    },
    {
      part: 'item-content',
      description: 'The collapsible region revealed when the item is open.',
    },
  ],
};
