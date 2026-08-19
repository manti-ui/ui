import { Heading } from '@manti-ui/react';

export default function HeadingEmphasisDemo() {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
      <Heading level={3}>Default title</Heading>
      <Heading level={3} emphasis="muted">
        Muted title
      </Heading>
      <Heading level={3} variant="danger">
        Danger title
      </Heading>
    </div>
  );
}
