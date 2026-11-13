import type { Story, StoryDefault } from '@ladle/react';

import { Popover } from './Popover.js';
import type { PopoverProps } from './Popover.js';
import { Badge } from '../Badge/Badge.js';
import { Button } from '../Button/Button.js';
import { Text } from '../Text/Text.js';

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

const notifications = [
  {
    title: 'Order #1042 shipped',
    meta: 'Two trays of manti are on their way to Kayseri.',
    tag: 'Orders',
  },
  {
    title: 'Dough recipe updated',
    meta: 'Resting time changed from 20 to 30 minutes.',
    tag: 'Recipes',
  },
  {
    title: 'New review on Yogurt sauce',
    meta: 'Five stars: the garlic is exactly right.',
    tag: 'Reviews',
  },
] as const;

/**
 * A list laid out at a fixed 24rem. The default 20rem cap would let every row
 * run past the panel edge; `maxWidth` lets the panel grow to hold it.
 */
export const WideContent: Story<PopoverProps> = (args) => (
  <Popover
    {...args}
    title="Notifications"
    maxWidth="28rem"
    trigger={<Button variant="secondary">Notifications</Button>}
  >
    <div
      style={{
        display: 'grid',
        gap: 'var(--manti-space-3)',
        width: '24rem',
      }}
    >
      {notifications.map((item) => (
        <div
          key={item.title}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--manti-space-3)',
          }}
        >
          <div style={{ display: 'grid', gap: 'var(--manti-space-1)' }}>
            <Text as="span" size="sm/medium">
              {item.title}
            </Text>
            <Text as="span" size="xs" emphasis="muted">
              {item.meta}
            </Text>
          </div>
          <Badge>{item.tag}</Badge>
        </div>
      ))}
    </div>
  </Popover>
);
WideContent.args = { defaultOpen: true };

/** At the default width, long words and links wrap inside the panel. */
export const DefaultWidthWrapping: Story<PopoverProps> = (args) => (
  <Popover {...args} title="Share this recipe">
    Send the link to anyone who should see it:
    https://manti.example/recipes/kayseri-mantisi-with-garlic-yogurt-and-pul-biber-butter
  </Popover>
);
DefaultWidthWrapping.args = { defaultOpen: true };
