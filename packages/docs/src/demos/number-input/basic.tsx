import { NumberInput } from '@manti-ui/react';

export default function NumberInputBasic() {
  return (
    <NumberInput
      label="Servings"
      variant="primary"
      defaultValue="12"
      min={0}
      max={99}
      step={1}
    />
  );
}
