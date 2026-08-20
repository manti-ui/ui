import { Input } from '@manti-ui/react';

export default function InputVariants() {
  return (
    <div className="input-option-grid">
      <Input aria-label="Default name" placeholder="Default" />
      <Input aria-label="Filled name" placeholder="Name" variant="fill" />
    </div>
  );
}
