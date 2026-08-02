import { Button, Input } from '@manti-ui/react';

export default function InputLeftRight() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-4)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
      }}
    >
      <Input
        label="Price"
        left="$"
        right="USD"
        inputMode="decimal"
        placeholder="0.00"
      />
      <Input
        label="Discount code"
        placeholder="MANTI20"
        right={
          <Button size="sm" variant="tertiary">
            Apply
          </Button>
        }
      />
    </div>
  );
}
