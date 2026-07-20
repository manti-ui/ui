import { Badge } from '@manti-ui/react';

export default function BadgeDot() {
  return (
    <>
      <Badge variant="primary" dot>
        Online
      </Badge>
      <Badge variant="primary" dot>
        Away
      </Badge>
      <Badge variant="danger" dot>
        Offline
      </Badge>
    </>
  );
}
