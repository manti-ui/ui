import { Input } from '@manti-ui/react';

export default function InputStates() {
  return (
    <div className="input-state-grid">
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
