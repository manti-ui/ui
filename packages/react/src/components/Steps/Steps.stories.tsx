import type { Story, StoryDefault } from '@ladle/react';

import { Steps } from './Steps.js';
import type { StepsProps } from './Steps.js';

const items = [
  { title: 'Dough', description: 'Knead & rest', content: 'Make the dough.' },
  { title: 'Fill', description: 'Spoon & fold', content: 'Fill the wrappers.' },
  { title: 'Steam', description: 'Cook through', content: 'Steam until done.' },
];

export default {
  title: 'Components/Steps',
  args: {
    items,
    variant: 'primary',
    orientation: 'horizontal',
    defaultStep: 0,
    controls: true,
  },
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'],
    },
  },
  meta: { layout: 'padded' },
} satisfies StoryDefault<StepsProps>;

export const Playground: Story<StepsProps> = (args) => <Steps {...args} />;

export const Vertical: Story<StepsProps> = (args) => <Steps {...args} />;
Vertical.args = { orientation: 'vertical' };
