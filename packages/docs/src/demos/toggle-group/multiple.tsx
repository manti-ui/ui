import { ToggleGroup } from '@manti-ui/react';

const items = [
  { value: 'bold', label: 'B' },
  { value: 'italic', label: 'I' },
  { value: 'underline', label: 'U' },
];

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup
      items={items}
      tone="primary"
      multiple
      defaultValue={['bold', 'underline']}
    />
  );
}
