import type { Story, StoryDefault } from '@ladle/react';

import { Button } from '../Button/Button.js';
import { Tooltip } from './Tooltip.js';
import type { TooltipProps } from './Tooltip.js';

export default {
  title: 'Components/Tooltip',
  args: {
    content: 'Backed by a Zag.js machine',
    children: <Button variant="secondary">Hover or focus me</Button>,
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<TooltipProps>;

export const Playground: Story<TooltipProps> = (args) => <Tooltip {...args} />;

export const Delayed: Story<TooltipProps> = (args) => <Tooltip {...args} />;
Delayed.args = { openDelay: 0, closeDelay: 0 };

export const PortalledAndControlled: Story<TooltipProps> = (args) => (
  <Tooltip {...args} />
);
PortalledAndControlled.args = {
  portalled: true,
  defaultOpen: true,
  placement: 'top',
};
