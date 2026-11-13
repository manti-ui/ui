import type { Story, StoryDefault } from '@ladle/react';

import { Collapsible } from './Collapsible.js';
import type { CollapsibleProps } from './Collapsible.js';
import { Text } from '../Text/Text.js';

export default {
  title: 'Components/Collapsible',
  args: {
    trigger: "Show chef's note",
    children: (
      <Text
        emphasis="muted"
        style={{ padding: 'var(--manti-space-3) var(--manti-space-1) 0' }}
      >
        Rest the dough for 30 minutes so it rolls out smooth and thin.
      </Text>
    ),
  },
  decorators: [
    (Component) => (
      <div style={{ width: 360 }}>
        <Component />
      </div>
    ),
  ],
  meta: { layout: 'padded' },
} satisfies StoryDefault<CollapsibleProps>;

export const Playground: Story<CollapsibleProps> = (args) => (
  <Collapsible {...args} />
);

export const OpenByDefault: Story<CollapsibleProps> = (args) => (
  <Collapsible {...args} />
);
OpenByDefault.args = { defaultOpen: true };

export const WithoutIndicator: Story<CollapsibleProps> = (args) => (
  <Collapsible {...args} />
);
WithoutIndicator.args = { indicator: false };
