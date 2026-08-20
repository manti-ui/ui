import { Badge, ScrollArea } from '@manti-ui/react';

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea
      orientation="horizontal"
      className="scroll-area-horizontal"
    >
      <div className="scroll-area-row">
        {Array.from({ length: 16 }, (_, i) => (
          <Badge key={i} variant="secondary">
            Tag {i + 1}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}
