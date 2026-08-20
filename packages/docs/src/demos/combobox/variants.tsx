import { Combobox } from '@manti-ui/react';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
];

export default function ComboboxVariants() {
  return (
    <div className="combobox-grid">
      <Combobox items={spices} label="Default" placeholder="Search spices…" />
      <Combobox
        items={spices}
        label="Filled"
        placeholder="Search spices…"
        variant="fill"
      />
    </div>
  );
}
