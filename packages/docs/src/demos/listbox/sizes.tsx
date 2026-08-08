import { Listbox } from '@manti-ui/react';

const fillings = [
  { value: 'lamb', label: 'Lamb & onion' },
  { value: 'beef', label: 'Beef & herb' },
  { value: 'pumpkin', label: 'Pumpkin' },
];

export default function ListboxSizes() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--manti-space-4)',
        flexWrap: 'wrap',
      }}
    >
      <Listbox
        size="sm"
        items={fillings}
        label="Small"
        defaultValue={['beef']}
      />
      <Listbox
        size="md"
        items={fillings}
        label="Medium"
        defaultValue={['beef']}
      />
      <Listbox
        size="lg"
        items={fillings}
        label="Large"
        defaultValue={['beef']}
      />
    </div>
  );
}
