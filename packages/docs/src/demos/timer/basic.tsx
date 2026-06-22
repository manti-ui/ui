import { Timer } from '@manti-ui/react';

export default function TimerBasic() {
  return <Timer parts={['hours', 'minutes', 'seconds']} autoStart controls />;
}
