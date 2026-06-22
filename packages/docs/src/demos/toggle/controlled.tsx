import { useState } from 'react';
import { Toggle } from '@manti-ui/react';

export default function ToggleControlled() {
  const [pressed, setPressed] = useState(true);

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--manti-space-3)',
        alignItems: 'center',
      }}
    >
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        Notifications
      </Toggle>
      <span style={{ color: 'var(--manti-text-muted)' }}>
        {pressed ? 'on' : 'off'}
      </span>
    </div>
  );
}
