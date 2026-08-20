import {
  Badge,
  Button,
  Calendar,
  Heading,
  SegmentedControl,
} from '@manti-ui/react';

export default function CalendarBoard() {
  return (
    <div className="calendar">
      <div className="calendar-toolbar">
        <Heading level={2} size="xl" className="calendar-heading">
          Calendar
        </Heading>
        <div className="calendar-actions">
          <SegmentedControl
            size="sm"
            variant="primary"
            defaultValue="month"
            items={[
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' },
              { value: 'day', label: 'Day' },
            ]}
          />
          <Button variant="primary" size="sm">
            + New event
          </Button>
        </div>
      </div>
      <Calendar
        defaultValue={['2026-07-02']}
        renderDay={(day) =>
          day.day === 3 || day.day === 9 || day.day === 18 ? (
            <Badge variant={day.day === 18 ? 'danger' : 'primary'} size="sm">
              {day.day === 18 ? 'Review' : 'Standup'}
            </Badge>
          ) : null
        }
      />
    </div>
  );
}
