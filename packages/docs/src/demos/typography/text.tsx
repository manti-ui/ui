import { Text } from '@manti-ui/react';

export default function TextDemo() {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-3)' }}>
      <Text size="lg/semibold">
        Behavior you can trust, styling you can own.
      </Text>
      <Text>
        Manti UI keeps interaction logic in framework-agnostic machines and
        ships the look as design tokens.
      </Text>
      <Text emphasis="muted" size="sm">
        Updated a few minutes ago.
      </Text>
    </div>
  );
}
