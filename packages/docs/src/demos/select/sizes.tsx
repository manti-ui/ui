import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
];

export default function SelectSizes() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 5)',
      }}
    >
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
