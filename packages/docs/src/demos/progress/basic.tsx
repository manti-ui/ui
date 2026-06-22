import { Progress } from '@manti-ui/react';

export default function ProgressBasic() {
  return (
    <div style={{ width: '100%', maxWidth: 'calc(var(--manti-space-16) * 8)' }}>
      <Progress label="Steaming" defaultValue={65} showValue tone="primary" />
    </div>
  );
}
