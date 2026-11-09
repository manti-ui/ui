import type { Story, StoryDefault } from '@ladle/react';

import { FloatingPanel } from './FloatingPanel.js';
import type { FloatingPanelProps } from './FloatingPanel.js';
import { Button } from '../Button/Button.js';
import { Text } from '../Text/Text.js';

export default {
  title: 'Components/FloatingPanel',
  args: {
    trigger: <Button>Open panel</Button>,
    title: 'Layers',
    children: (
      <Text emphasis="muted">
        Drag me by the header, or resize from any edge.
      </Text>
    ),
    draggable: true,
    resizable: true,
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<FloatingPanelProps>;

export const Playground: Story<FloatingPanelProps> = (args) => (
  <FloatingPanel {...args} />
);
