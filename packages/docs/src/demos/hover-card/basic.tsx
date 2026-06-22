import { HoverCard } from '@manti-ui/react';

export default function HoverCardBasic() {
  return (
    <HoverCard
      trigger={<a href="https://en.wikipedia.org/wiki/Manti_(food)">@manti</a>}
    >
      <div style={{ display: 'grid', gap: 'var(--manti-space-1)' }}>
        <strong>Mantı</strong>
        <span style={{ color: 'var(--manti-text-muted)' }}>
          Tiny Turkish dumplings served under garlicky yogurt and chili butter.
        </span>
      </div>
    </HoverCard>
  );
}
