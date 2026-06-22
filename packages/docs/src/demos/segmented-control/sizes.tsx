import { SegmentedControl } from '@manti-ui/react';

const items = [
  { value: 'boiled', label: 'Boiled' },
  { value: 'steamed', label: 'Steamed' },
  { value: 'fried', label: 'Fried' },
];

export default function SegmentedControlSizes() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-4)',
        alignItems: 'flex-start',
      }}
    >
      <SegmentedControl size="sm" items={items} defaultValue="boiled" />
      <SegmentedControl size="md" items={items} defaultValue="boiled" />
      <SegmentedControl size="lg" items={items} defaultValue="boiled" />
    </div>
  );
}
