import { Badge, ScrollArea } from '@manti-ui/react';

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea
      orientation="horizontal"
      style={{
        width: '100%',
        maxWidth: 'calc(var(--manti-space-16) * 6)',
        border: '1px solid var(--manti-border)',
        borderRadius: 'var(--manti-radius-md)',
        background: 'var(--manti-surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 'var(--manti-space-2)',
          padding: 'var(--manti-space-3)',
        }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <Badge key={i} tone="neutral" variant="soft">
            Tag {i + 1}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}
