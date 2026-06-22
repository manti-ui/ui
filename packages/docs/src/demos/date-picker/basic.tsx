import { DatePicker } from '@manti-ui/react';

export default function DatePickerBasic() {
  return (
    <DatePicker
      label="Reservation date"
      tone="primary"
      defaultValue={['2026-06-15']}
    />
  );
}
