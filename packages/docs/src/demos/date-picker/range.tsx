import { DatePicker } from '@manti-ui/react';

export default function DatePickerRange() {
  return (
    <DatePicker
      label="Stay"
      selectionMode="range"
      defaultValue={['2026-06-15', '2026-06-20']}
    />
  );
}
