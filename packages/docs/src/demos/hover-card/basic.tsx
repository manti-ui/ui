import { HoverCard, Text } from '@manti-ui/react';

export default function HoverCardBasic() {
  return (
    <HoverCard
      trigger={
        <a
          href="https://en.wikipedia.org/wiki/Manti_(food)"
          target="_blank"
          rel="noreferrer"
        >
          @manti
        </a>
      }
    >
      <div className="hover-card-content">
        <strong>Mantı</strong>
        <Text as="span" emphasis="muted">
          Tiny Turkish dumplings served under garlicky yogurt and chili butter.
        </Text>
      </div>
    </HoverCard>
  );
}
