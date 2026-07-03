import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Calendar } from './Calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
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
      <div style={{ width: 'min(64rem, 95vw)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * A full month board: a title bar with a view switcher and a primary action
 * above the calendar's own Today/prev/next toolbar, with events rendered per day.
 */
export const MonthView: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 'var(--manti-text-xl)',
            fontWeight: 'var(--manti-weight-semibold)',
          }}
        >
          Calendar
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SegmentedControl
            size="sm"
            tone="primary"
            defaultValue="month"
            items={[
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' },
              { value: 'day', label: 'Day' },
            ]}
          />
          <Button tone="primary" size="sm">
            + New event
          </Button>
        </div>
      </div>
      <Calendar
        {...args}
        renderDay={(day) =>
          day.day === 3 || day.day === 9 || day.day === 18 ? (
            <Badge tone={day.day === 18 ? 'warning' : 'primary'} size="sm">
              {day.day === 18 ? 'Review' : 'Standup'}
            </Badge>
          ) : null
        }
      />
    </div>
  ),
};

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
