import { Progress } from '@manti-ui/react';

export default function ProgressBasic() {
  return (
    <div className="progress">
      <Progress label="Steaming" defaultValue={65} showValue />
    </div>
  );
}
