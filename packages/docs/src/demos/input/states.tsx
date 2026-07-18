import { Input } from '@manti-ui/react';

export default function InputStates() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
      <Input label="Small" size="sm" placeholder="Kayseri mantısı" />
      <Input label="Medium" size="md" placeholder="Kayseri mantısı" />
      <Input label="Large" size="lg" placeholder="Kayseri mantısı" />
      <Input
        label="Recipe name"
        defaultValue="mantı"
        error="This recipe name is already taken."
      />
      <Input label="Locked recipe" defaultValue="Locked recipe" disabled />
    </div>
  );
}
