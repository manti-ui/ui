import { PinInput } from '@manti-ui/react';

export default function PinInputSizes() {
  return (
    <div className="pin-input-options">
      <PinInput size="sm" label="Small" length={4} type="numeric" otp />
      <PinInput size="md" label="Medium" length={4} type="numeric" otp />
      <PinInput size="lg" label="Large" length={4} type="numeric" otp />
    </div>
  );
}
