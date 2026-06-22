import { Button, FloatingPanel } from '@manti-ui/react';

export default function FloatingPanelBasic() {
  return (
    <FloatingPanel trigger={<Button>Open panel</Button>} title="Layers">
      <p style={{ margin: 0, color: 'var(--manti-text-muted)' }}>
        Drag me by the header, or resize from any edge.
      </p>
    </FloatingPanel>
  );
}
