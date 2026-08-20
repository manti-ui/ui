import { Progress } from '@manti-ui/react';

export default function ProgressSizes() {
  return (
    <div className="progress-stack">
      <Progress size="sm" label="Small" defaultValue={40} />
      <Progress size="md" label="Medium" defaultValue={65} />
      <Progress size="lg" label="Large" defaultValue={90} />
    </div>
  );
}
