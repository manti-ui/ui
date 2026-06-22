import { PinInput } from '@manti-ui/react';

export default function PinInputMasked() {
  return <PinInput label="PIN" length={4} type="numeric" mask />;
}
