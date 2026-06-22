import { Select } from '@manti-ui/react';

const regions = [
  { value: 'kayseri', label: 'Kayseri' },
  { value: 'bukhara', label: 'Bukhara' },
  { value: 'kashgar', label: 'Kashgar' },
  { value: 'yerevan', label: 'Yerevan' },
  { value: 'sarajevo', label: 'Sarajevo' },
];

export default function SelectBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 7)' }}>
      <Select
        items={regions}
        label="Region"
        placeholder="Pick a region…"
        tone="primary"
      />
    </div>
  );
}
