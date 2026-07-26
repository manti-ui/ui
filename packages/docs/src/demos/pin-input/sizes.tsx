import { PinInput } from '@manti-ui/react';

export default function PinInputSizes() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-4)',
        alignItems: 'flex-start',
      }}
    >
      <PinInput size="sm" label="Small" length={4} type="numeric" otp />
      <PinInput size="md" label="Medium" length={4} type="numeric" otp />
      <PinInput size="lg" label="Large" length={4} type="numeric" otp />
    </div>
  );
}
