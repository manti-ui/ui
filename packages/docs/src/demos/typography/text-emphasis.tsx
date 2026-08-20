import { Text } from '@manti-ui/react';

export default function TextEmphasisDemo() {
  return (
    <div className="text-list">
      <Text>Default — the sentence a reader is meant to finish.</Text>
      <Text emphasis="muted">Muted — supporting detail beside it.</Text>
      <Text emphasis="subtle">Subtle — metadata that should not compete.</Text>
    </div>
  );
}
