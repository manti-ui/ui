import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
  { value: 'sarajevo', label: 'Sarajevo' },
];

export default function SelectMultiple() {
  return (
    <div className="select-field">
      <Select
        items={regions}
        label="Regions"
        multiple
        defaultValue={['kayseri', 'kashgar']}
      />
    </div>
  );
}
