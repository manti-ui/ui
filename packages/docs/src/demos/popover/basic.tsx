import { Button, Popover } from '@manti-ui/react';

export default function PopoverBasic() {
  return (
    <Popover
      trigger={<Button variant="soft">Tips</Button>}
      title="Dough resting"
    >
      Let the dough rest, covered, for 30 minutes. It relaxes the gluten so you
      can roll it paper-thin without it springing back.
    </Popover>
  );
}
