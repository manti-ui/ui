import { SegmentedControl } from '@manti-ui/react';

const items = [
  { value: 'boiled', label: 'Boiled' },
  { value: 'steamed', label: 'Steamed' },
  { value: 'fried', label: 'Fried' },
];

export default function SegmentedControlSizes() {
  return (
    <div className="segmented-control-options">
      <SegmentedControl size="sm" items={items} defaultValue="boiled" />
      <SegmentedControl size="md" items={items} defaultValue="boiled" />
      <SegmentedControl size="lg" items={items} defaultValue="boiled" />
    </div>
  );
}
