import { Heading, Text } from '@manti-ui/react';

export default function HeadingLevelVsSizeDemo() {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
      <Heading level={1} size="4xl">
        h1 at 4xl
      </Heading>
      <Heading level={2} size="sm" emphasis="muted">
        h2 at sm — an eyebrow that still belongs to the outline
      </Heading>
      <Text emphasis="subtle" size="sm">
        Both are real heading elements; only the visual stop changed.
      </Text>
    </div>
  );
}
