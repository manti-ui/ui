import { RadioGroup } from '@manti-ui/react';

const items = [
  { value: 'boiled', label: 'Boiled' },
  { value: 'steamed', label: 'Steamed' },
  { value: 'fried', label: 'Fried', disabled: true },
];

export default function RadioGroupBasic() {
  return (
    <RadioGroup
      label="Cooking method"
      items={items}
      defaultValue="boiled"
      tone="primary"
    />
  );
}
