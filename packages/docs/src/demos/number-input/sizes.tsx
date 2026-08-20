import { NumberInput } from '@manti-ui/react';

export default function NumberInputSizes() {
  return (
    <div className="number-input-options">
      <NumberInput size="sm" label="Small" defaultValue="12" min={0} max={99} />
      <NumberInput
        size="md"
        label="Medium"
        defaultValue="12"
        min={0}
        max={99}
      />
      <NumberInput size="lg" label="Large" defaultValue="12" min={0} max={99} />
    </div>
  );
}
