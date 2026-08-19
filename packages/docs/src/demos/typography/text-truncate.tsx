import { Card, Text } from '@manti-ui/react';

export default function TextTruncateDemo() {
  return (
    <div style={{ maxWidth: 'calc(var(--manti-space-16) * 5)' }}>
      <Card>
        <Text size="base/semibold" truncate>
          A single-line title that runs well past the width of its card
        </Text>
        <Text emphasis="muted" size="sm" lineClamp={2}>
          Manti UI keeps behavior in framework-agnostic machines and ships the
          look as tokens, so a component can be restyled without forking it or
          reaching into its internals.
        </Text>
      </Card>
    </div>
  );
}
