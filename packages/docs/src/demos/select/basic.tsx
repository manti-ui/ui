import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
  { value: 'sarajevo', label: 'Sarajevo' },
];

export default function SelectBasic() {
  return (
    <div className="select-field">
      <Select items={regions} label="Region" placeholder="Pick a region…" />
    </div>
  );
}
