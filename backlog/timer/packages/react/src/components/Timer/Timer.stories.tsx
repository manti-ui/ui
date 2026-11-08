import type { Story, StoryDefault } from '@ladle/react';

import { Timer } from './Timer';
import type { TimerProps } from './Timer';

export default {
  title: 'Components/Timer',
  args: {
    parts: ['hours', 'minutes', 'seconds'],
    autoStart: true,
    controls: true,
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<TimerProps>;

export const Playground: Story<TimerProps> = (args) => <Timer {...args} />;

export const Countdown: Story<TimerProps> = (args) => <Timer {...args} />;
Countdown.args = {
  countdown: true,
  startMs: 90_000,
  parts: ['minutes', 'seconds'],
};
