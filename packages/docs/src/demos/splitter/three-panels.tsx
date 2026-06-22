import { Splitter } from '@manti-ui/react';

const pane = (label: string) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      height: 'calc(var(--manti-space-16) * 3)',
      color: 'var(--manti-text-muted)',
    }}
  >
    {label}
  </div>
);

export default function SplitterThreePanels() {
  return (
    <div style={{ width: '100%' }}>
      <Splitter
        panels={[
          { id: 'a', content: pane('Left') },
          { id: 'b', content: pane('Center') },
          { id: 'c', content: pane('Right') },
        ]}
        defaultSize={[25, 50, 25]}
      />
    </div>
  );
}
