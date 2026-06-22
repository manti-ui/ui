import { PinInput } from '@manti-ui/react';

export default function PinInputBasic() {
  return (
    <PinInput
      label="One-time code"
      length={4}
      type="numeric"
      otp
      tone="primary"
    />
  );
}
