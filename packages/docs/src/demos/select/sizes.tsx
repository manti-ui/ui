import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
];

export default function SelectSizes() {
  return (
    <div className="select-stack">
      <Select size="sm" items={regions} label="Small" placeholder="Pick one…" />
      <Select
        size="md"
        items={regions}
        label="Medium"
        placeholder="Pick one…"
      />
      <Select size="lg" items={regions} label="Large" placeholder="Pick one…" />
    </div>
  );
}
