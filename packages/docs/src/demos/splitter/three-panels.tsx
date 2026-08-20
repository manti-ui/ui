import { Splitter } from '@manti-ui/react';

const pane = (label: string) => (
  <div className="splitter-pane">{label}</div>
);

export default function SplitterThreePanels() {
  return (
    <div className="splitter">
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
