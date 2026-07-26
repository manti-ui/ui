import { Input } from '@manti-ui/react';

export default function InputVariants() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
      <Input aria-label="Default name" placeholder="Default" />
      <Input aria-label="Filled name" placeholder="Name" variant="fill" />
    </div>
  );
}
