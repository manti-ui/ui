import { Button, Drawer } from '@manti-ui/react';

const placements = ['left', 'right', 'top', 'bottom'] as const;

export default function DrawerPlacements() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--manti-space-3)',
      }}
    >
      {placements.map((placement) => (
        <Drawer
          key={placement}
          placement={placement}
          title={`From the ${placement}`}
          description={`This drawer slides in from the ${placement} edge.`}
          trigger={<Button variant="outline">{placement}</Button>}
        >
          A panel anchored to the {placement} edge of the viewport.
        </Drawer>
      ))}
    </div>
  );
}
