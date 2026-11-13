import type { Story, StoryDefault } from '@ladle/react';

import { Accordion } from './Accordion.js';
import type { AccordionProps } from './Accordion.js';

const items = [
  {
    value: 'shape',
    title: 'How small should they be?',
    content: 'Traditionally tiny — a good cook fits many on a single spoon.',
  },
  {
    value: 'serve',
    title: 'What goes on top?',
    content: 'Garlic yogurt, melted chili butter, dried mint, and sumac.',
  },
  {
    value: 'freeze',
    title: 'Can I freeze them?',
    content: 'Yes — freeze raw on a tray, then bag once solid.',
  },
];

export default {
  title: 'Components/Accordion',
  args: { items, defaultValue: ['shape'], multiple: false, collapsible: true },
  decorators: [
    (Component) => (
      <div style={{ width: 460 }}>
        <Component />
      </div>
    ),
  ],
  meta: { layout: 'padded' },
} satisfies StoryDefault<AccordionProps>;

export const Playground: Story<AccordionProps> = (args) => (
  <Accordion {...args} />
);

export const Multiple: Story<AccordionProps> = (args) => (
  <Accordion {...args} />
);
Multiple.args = { multiple: true, defaultValue: ['shape', 'serve'] };
