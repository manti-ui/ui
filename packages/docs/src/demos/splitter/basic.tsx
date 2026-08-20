import { Splitter } from '@manti-ui/react';

const pane = (label: string) => (
  <div className="splitter-pane">{label}</div>
);

export default function SplitterBasic() {
  return (
    <div className="splitter">
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
