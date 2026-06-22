import { Listbox } from '@manti-ui/react';

const fillings = [
  { value: 'lamb', label: 'Lamb & onion' },
  { value: 'beef', label: 'Beef & herb' },
  { value: 'pumpkin', label: 'Pumpkin' },
  { value: 'potato', label: 'Potato', disabled: true },
  { value: 'spinach', label: 'Spinach & cheese' },
];

export default function ListboxBasic() {
  return (
    <Listbox
      items={fillings}
      label="Filling"
      tone="primary"
      defaultValue={['beef']}
    />
  );
}
