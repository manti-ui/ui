import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
];

export default function SelectVariants() {
  return (
    <div className="select-grid">
      <Select items={regions} label="Default" placeholder="Pick a region…" />
      <Select
        items={regions}
        label="Filled"
        placeholder="Pick a region…"
        variant="fill"
      />
    </div>
  );
}
