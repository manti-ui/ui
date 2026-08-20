import { ToggleGroup } from '@manti-ui/react';

const items = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export default function ToggleGroupSizes() {
  return (
    <div className="toggle-group-options">
      <ToggleGroup size="sm" items={items} defaultValue={['center']} />
      <ToggleGroup size="md" items={items} defaultValue={['center']} />
      <ToggleGroup size="lg" items={items} defaultValue={['center']} />
    </div>
  );
}
