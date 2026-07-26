import { Progress } from '@manti-ui/react';

export default function ProgressSizes() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-5)',
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 8)',
      }}
    >
      <Progress size="sm" label="Small" defaultValue={40} />
      <Progress size="md" label="Medium" defaultValue={65} />
      <Progress size="lg" label="Large" defaultValue={90} />
    </div>
  );
}
