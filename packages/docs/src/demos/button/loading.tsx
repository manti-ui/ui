import { useState } from 'react';
import { Button } from '@manti-ui/react';

export default function ButtonLoading() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      tone="primary"
      loading={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
      }}
    >
      Save changes
    </Button>
  );
}
