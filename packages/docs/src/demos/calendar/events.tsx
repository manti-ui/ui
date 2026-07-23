import { Badge, Calendar } from '@manti-ui/react';

export default function CalendarEvents() {
  return (
    <Calendar
      readOnly
      renderDay={(day) =>
        day.day === 2 || day.day === 9 || day.day === 18 ? (
          <Badge variant={day.day === 18 ? 'danger' : 'primary'} size="sm">
            {day.day === 18 ? 'Review' : 'Standup'}
          </Badge>
        ) : null
      }
    />
  );
}
