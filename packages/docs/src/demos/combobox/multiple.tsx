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

export default function ComboboxMultiple() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 5)' }}>
      <Combobox
        items={spices}
        label="Spices"
        placeholder="Search spices…"
        multiple
        defaultValue={['sumac', 'mint']}
      />
    </div>
  );
}
