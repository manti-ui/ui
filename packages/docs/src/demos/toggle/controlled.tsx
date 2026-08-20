import { useState } from 'react';
import { Toggle } from '@manti-ui/react';

export default function ToggleControlled() {
  const [pressed, setPressed] = useState(true);

  return (
    <div className="toggle-actions">
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        Notifications
      </Toggle>
      <span className="toggle-status">
        {pressed ? 'on' : 'off'}
      </span>
    </div>
  );
}
