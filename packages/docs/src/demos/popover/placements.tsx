import { Button, Popover } from '@manti-ui/react';

const placements = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const;

export default function PopoverPlacements() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 'var(--manti-space-3)',
      }}
    >
      {placements.map((placement) => (
        <Popover
          key={placement}
          placement={placement}
          title={placement}
          trigger={<Button variant="tertiary">{placement}</Button>}
        >
          The panel is anchored to the {placement} of its trigger.
        </Popover>
      ))}
    </div>
  );
}
