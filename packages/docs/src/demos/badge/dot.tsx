import { Badge } from '@manti-ui/react';

export default function BadgeDot() {
  return (
    <>
      <Badge tone="success" dot>
        Online
      </Badge>
      <Badge tone="warning" dot>
        Away
      </Badge>
      <Badge tone="danger" dot>
        Offline
      </Badge>
    </>
  );
}
