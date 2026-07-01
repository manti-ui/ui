import { Badge, Button, Calendar, SegmentedControl } from '@manti-ui/react';

export default function CalendarBoard() {
  return (
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
        defaultValue={['2026-07-02']}
        renderDay={(day) =>
          day.day === 3 || day.day === 9 || day.day === 18 ? (
            <Badge tone={day.day === 18 ? 'warning' : 'primary'} size="sm">
              {day.day === 18 ? 'Review' : 'Standup'}
            </Badge>
          ) : null
        }
      />
    </div>
  );
}
