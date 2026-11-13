import type { Story, StoryDefault } from '@ladle/react';

import { Splitter } from './Splitter.js';
import type { SplitterProps } from './Splitter.js';

const pane = (label: string) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 200,
      color: 'var(--manti-text-muted)',
    }}
  >
    {label}
  </div>
);

export default {
  title: 'Components/Splitter',
  args: {
    orientation: 'horizontal',
    panels: [
      { id: 'a', content: pane('Sidebar') },
      { id: 'b', content: pane('Main') },
    ],
    defaultSize: [30, 70],
  },
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<SplitterProps>;

export const Playground: Story<SplitterProps> = (args) => (
  <Splitter {...args} />
);

export const ThreePanels: Story<SplitterProps> = (args) => (
  <Splitter {...args} />
);
ThreePanels.args = {
  panels: [
    { id: 'a', content: pane('Left') },
    { id: 'b', content: pane('Center') },
    { id: 'c', content: pane('Right') },
  ],
  defaultSize: [25, 50, 25],
};
