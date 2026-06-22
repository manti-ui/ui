import { Button, Tooltip } from '@manti-ui/react';

export default function TooltipBasic() {
  return (
    <>
      <Tooltip content="Backed by a Zag.js machine">
        <Button variant="soft">Hover or focus me</Button>
      </Tooltip>
      <Tooltip content="Stays open while you hover the label" interactive>
        <Button variant="outline">Interactive</Button>
      </Tooltip>
    </>
  );
}
