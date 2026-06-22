import { TextField } from '@manti-ui/react';

export default function TextFieldStates() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
      <TextField label="Small" size="sm" placeholder="Kayseri mantısı" />
      <TextField label="Medium" size="md" placeholder="Kayseri mantısı" />
      <TextField label="Large" size="lg" placeholder="Kayseri mantısı" />
      <TextField
        label="Recipe name"
        defaultValue="mantı"
        error="This recipe name is already taken."
      />
      <TextField label="Locked recipe" defaultValue="Locked recipe" disabled />
    </div>
  );
}
