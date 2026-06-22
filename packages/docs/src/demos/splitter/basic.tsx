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

export default function SplitterBasic() {
  return (
    <div style={{ width: '100%' }}>
      <Splitter
        panels={[
          { id: 'a', content: pane('Sidebar') },
          { id: 'b', content: pane('Main') },
        ]}
        defaultSize={[30, 70]}
      />
    </div>
  );
}
