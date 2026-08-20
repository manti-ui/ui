import { Text } from '@manti-ui/react';

export default function TextDemo() {
  return (
    <div className="text-list">
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
