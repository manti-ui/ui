import { Combobox } from '@manti-ui/react';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
  { value: 'mint', label: 'Dried mint' },
  { value: 'pepper', label: 'Black pepper' },
];

export default function ComboboxSizes() {
  return (
    <div className="combobox-stack">
      <Combobox size="sm" items={spices} label="Small" placeholder="Search…" />
      <Combobox size="md" items={spices} label="Medium" placeholder="Search…" />
      <Combobox size="lg" items={spices} label="Large" placeholder="Search…" />
    </div>
  );
}
