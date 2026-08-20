import { Button, Drawer } from '@manti-ui/react';

const placements = ['left', 'right', 'top', 'bottom'] as const;

export default function DrawerPlacements() {
  return (
    <div className="drawer-options">
      {placements.map((placement) => (
        <Drawer
          key={placement}
          placement={placement}
          title={`From the ${placement}`}
          description={`This drawer slides in from the ${placement} edge.`}
          trigger={<Button variant="tertiary">{placement}</Button>}
        >
          A panel anchored to the {placement} edge of the viewport.
        </Drawer>
      ))}
    </div>
  );
}
