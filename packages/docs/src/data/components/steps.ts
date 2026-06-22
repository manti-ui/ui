import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'steps',
  props: [
    {
      name: 'items',
      type: 'StepItem[]',
      description: 'The steps. Each item: { title, description?, content? }.',
    },
    {
      name: 'tone',
      type: 'MantiTone',
      default: `'primary'`,
      description: 'Tone of the active and completed steps.',
    },
    {
      name: 'orientation',
      type: `'horizontal' | 'vertical'`,
      default: `'horizontal'`,
      description: 'Layout direction.',
    },
    {
      name: 'linear',
      type: 'boolean',
      description: 'Require steps to be completed in order.',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Controlled active step index.',
    },
    {
      name: 'defaultStep',
      type: 'number',
      default: '0',
      description: 'Initial active step for uncontrolled usage.',
    },
    {
      name: 'onStepChange',
      type: '(step: number) => void',
      description: 'Called whenever the active step changes.',
    },
    {
      name: 'controls',
      type: 'boolean',
      default: 'true',
      description: 'Render the built-in prev/next controls.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The flow container.' },
    { part: 'list', description: 'The row of step triggers.' },
    { part: 'item', description: 'A single step in the list.' },
    { part: 'trigger', description: 'The clickable step header.' },
    { part: 'indicator', description: 'The numbered step marker.' },
    {
      part: 'item-content',
      description: 'Wraps the step title and description.',
    },
    { part: 'item-title', description: 'The step title.' },
    { part: 'item-description', description: 'The optional step description.' },
    { part: 'separator', description: 'The connector line between steps.' },
    { part: 'content', description: 'The panel shown for the active step.' },
    { part: 'controls', description: 'The built-in prev/next buttons.' },
  ],
};
