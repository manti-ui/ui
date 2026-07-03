import { Calendar } from '@manti-ui/react';

export default function CalendarRange() {
  return (
    <Calendar
      selectionMode="range"
      defaultValue={['2026-07-08', '2026-07-14']}
    />
  );
}
