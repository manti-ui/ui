import { Button, Popover } from '@manti-ui/react';

export default function PopoverCloseButton() {
  return (
    <Popover
      trigger={<Button variant="soft">Tips</Button>}
      title="Dough resting"
      showCloseButton
    >
      Let the dough rest, covered, for 30 minutes, then roll it paper-thin.
    </Popover>
  );
}
