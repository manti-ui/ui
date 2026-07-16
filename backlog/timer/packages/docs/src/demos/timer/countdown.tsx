import { Timer } from '@manti-ui/react';

export default function TimerCountdown() {
  return (
    <Timer countdown startMs={90_000} parts={['minutes', 'seconds']} controls />
  );
}
