import type { Meta, StoryObj } from '@storybook/react-vite';

import { Timer } from './Timer';

const meta = {
  title: 'Components/Timer',
  component: Timer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    parts: ['hours', 'minutes', 'seconds'],
    autoStart: true,
    controls: true,
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Countdown: Story = {
  args: { countdown: true, startMs: 90_000, parts: ['minutes', 'seconds'] },
};
