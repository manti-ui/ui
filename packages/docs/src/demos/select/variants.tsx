import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
];

export default function SelectVariants() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 5)',
      }}
    >
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
