import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'tour',
  props: [
    {
      name: 'steps',
      type: 'TourStep[]',
      description:
        'The ordered steps — each `{ id, title, description, target?, placement? }`.',
    },
    {
      name: 'trigger',
      type: 'ReactElement',
      description:
        'Element that starts the tour. Cloned with an onClick handler.',
    },
  ],
  anatomy: [
    {
      part: 'backdrop',
      description: 'The dimming layer behind the spotlight.',
    },
    {
      part: 'spotlight',
      description: 'The cutout that highlights the targeted element.',
    },
    {
      part: 'positioner',
      description: 'The floating wrapper that positions the content.',
    },
    { part: 'content', description: 'The step card.' },
    { part: 'progress-text', description: 'The "step N of M" indicator.' },
    { part: 'title', description: 'The step title.' },
    { part: 'description', description: 'The step description.' },
    {
      part: 'arrow',
      description: 'The pointer connecting the card to its target.',
    },
    { part: 'close-trigger', description: 'The button that ends the tour.' },
    {
      part: 'actions',
      description: 'The Back / Next row; the last step finishes with "Done".',
    },
  ],
};
