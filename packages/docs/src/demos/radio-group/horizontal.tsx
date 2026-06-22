import { RadioGroup } from '@manti-ui/react';

const items = [
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'hot', label: 'Hot' },
];

export default function RadioGroupHorizontal() {
  return (
    <RadioGroup
      label="Spice level"
      items={items}
      defaultValue="medium"
      orientation="horizontal"
    />
  );
}
