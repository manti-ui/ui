import { Text } from '@manti-ui/react';

export default function TextVariantsDemo() {
  return (
    <div className="text-list">
      <Text variant="danger">Danger — this payment could not be captured.</Text>
      <Text variant="success">Success — the invoice was sent.</Text>
      <Text variant="info">Info — changes sync every few minutes.</Text>
      <Text variant="danger" emphasis="muted">
        Emphasis and variant are separate axes, so this danger note stays quiet.
      </Text>
    </div>
  );
}
