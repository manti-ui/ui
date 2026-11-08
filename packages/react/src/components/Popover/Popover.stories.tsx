import type { Story, StoryDefault } from '@ladle/react';

import { Popover } from './Popover.js';
import type { PopoverProps } from './Popover.js';
import { Button } from '../Button/Button.js';

export default {
  title: 'Components/Popover',
  args: {
    title: 'Dough resting',
    placement: 'bottom',
    trigger: <Button variant="secondary">Tips</Button>,
    children:
      'Let the dough rest, covered, for 30 minutes. It relaxes the gluten so you can roll it paper-thin without it springing back.',
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<PopoverProps>;

export const Playground: Story<PopoverProps> = (args) => <Popover {...args} />;

export const WithCloseButton: Story<PopoverProps> = (args) => (
  <Popover {...args} />
);
WithCloseButton.args = { showCloseButton: true };

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

export const Placements: Story<PopoverProps> = (args) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--manti-space-3)',
    }}
  >
    {placements.map((placement) => (
      <Popover
        {...args}
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
Placements.meta = { layout: 'padded' };
