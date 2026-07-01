import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge/Badge';
import { Calendar } from './Calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    tone: 'primary',
    selectionMode: 'single',
    defaultValue: ['2026-07-02'],
  },
  argTypes: {
    selectionMode: {
      control: 'inline-radio',
      options: ['single', 'multiple', 'range'],
    },
    tone: {
      control: 'select',
      options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    startOfWeek: {
      control: 'inline-radio',
      options: [0, 1],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(38rem, 90vw)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  args: {
    selectionMode: 'range',
    defaultValue: ['2026-07-08', '2026-07-14'],
  },
};

/** Display-only month with per-day event content via `renderDay`. */
export const WithEvents: Story = {
  args: {
    readOnly: true,
    renderDay: (day) =>
      day.day === 2 || day.day === 9 || day.day === 18 ? (
        <Badge tone={day.day === 18 ? 'warning' : 'primary'} size="sm">
          {day.day === 18 ? 'Review' : 'Standup'}
        </Badge>
      ) : null,
  },
};
