import { Combobox } from '@manti-ui/react';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
  { value: 'mint', label: 'Dried mint' },
  { value: 'pepper', label: 'Black pepper' },
  { value: 'chili', label: 'Chili flakes' },
  { value: 'coriander', label: 'Coriander' },
];

export default function ComboboxBasic() {
  return (
    <div className="combobox-field">
      <Combobox items={spices} label="Spice" placeholder="Search spices…" />
    </div>
  );
}
