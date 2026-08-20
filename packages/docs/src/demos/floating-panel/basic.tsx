import { Button, FloatingPanel, Text } from '@manti-ui/react';

export default function FloatingPanelBasic() {
  return (
    <FloatingPanel trigger={<Button>Open panel</Button>} title="Layers">
      <Text emphasis="muted">
        Drag me by the header, or resize from any edge.
      </Text>
    </FloatingPanel>
  );
}
