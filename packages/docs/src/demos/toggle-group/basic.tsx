import { ToggleGroup } from '@manti-ui/react';

const items = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export default function ToggleGroupBasic() {
  return <ToggleGroup items={items} tone="primary" defaultValue={['center']} />;
}
