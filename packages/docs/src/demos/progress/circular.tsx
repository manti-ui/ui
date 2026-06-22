import { Progress } from '@manti-ui/react';

export default function ProgressCircular() {
  return (
    <Progress
      variant="circular"
      label="Steaming"
      defaultValue={65}
      showValue
      tone="primary"
    />
  );
}
