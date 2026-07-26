import { Combobox } from '@manti-ui/react';

const spices = [
  { value: 'sumac', label: 'Sumac' },
  { value: 'paprika', label: 'Paprika' },
  { value: 'cumin', label: 'Cumin' },
];

export default function ComboboxVariants() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 5)',
      }}
    >
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
