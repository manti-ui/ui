import { useState } from 'react';
import { Alert, Button } from '@manti-ui/react';

export default function AlertDismissible() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button size="sm" variant="soft" onClick={() => setOpen(true)}>
        Show alert
      </Button>
    );
  }

  return (
    <Alert
      tone="info"
      title="Dough is resting"
      onDismiss={() => setOpen(false)}
    >
      Give it 30 minutes before you start rolling.
    </Alert>
  );
}
