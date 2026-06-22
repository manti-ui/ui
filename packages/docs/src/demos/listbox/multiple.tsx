import { Listbox } from '@manti-ui/react';

const fillings = [
  { value: 'lamb', label: 'Lamb & onion' },
  { value: 'beef', label: 'Beef & herb' },
  { value: 'pumpkin', label: 'Pumpkin' },
  { value: 'spinach', label: 'Spinach & cheese' },
];

export default function ListboxMultiple() {
  return (
    <Listbox
      items={fillings}
      label="Fillings"
      tone="primary"
      selectionMode="multiple"
      defaultValue={['lamb', 'pumpkin']}
    />
  );
}
