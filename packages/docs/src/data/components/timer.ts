import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'timer',
  props: [
    {
      name: 'parts',
      type: `('days' | 'hours' | 'minutes' | 'seconds')[]`,
      default: `['hours', 'minutes', 'seconds']`,
      description: 'Which time segments to display, in order.',
    },
    {
      name: 'countdown',
      type: 'boolean',
      description: 'Count down toward `targetMs` instead of up.',
    },
    {
      name: 'startMs',
      type: 'number',
      description: 'Start offset, in milliseconds.',
    },
    {
      name: 'targetMs',
      type: 'number',
      description: 'Target, in milliseconds (for countdown).',
    },
    {
      name: 'autoStart',
      type: 'boolean',
      default: 'true',
      description: 'Start automatically on mount.',
    },
    {
      name: 'controls',
      type: 'boolean',
      description: 'Show start / pause / reset controls.',
    },
    {
      name: 'onComplete',
      type: '() => void',
      description: 'Called when a countdown reaches zero.',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The outer wrapper.' },
    { part: 'area', description: 'The row of segments and separators.' },
    { part: 'item', description: 'A single segment cell (value plus label).' },
    { part: 'item-value', description: 'The numeric value of a segment.' },
    { part: 'item-label', description: 'The caption under a segment.' },
    { part: 'separator', description: 'The colon between segments.' },
    {
      part: 'control',
      description: 'The optional start / pause / reset controls.',
    },
  ],
};
