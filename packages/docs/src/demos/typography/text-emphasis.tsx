import { Text } from '@manti-ui/react';

export default function TextEmphasisDemo() {
  return (
    <div style={{ display: 'grid', gap: 'var(--manti-space-3)' }}>
      <Text>Default — the sentence a reader is meant to finish.</Text>
      <Text emphasis="muted">Muted — supporting detail beside it.</Text>
      <Text emphasis="subtle">Subtle — metadata that should not compete.</Text>
    </div>
  );
}
