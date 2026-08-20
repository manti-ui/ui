import type { Meta, StoryObj } from '@storybook/react-vite';

import { FloatingPanel } from './FloatingPanel';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/FloatingPanel',
  component: FloatingPanel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
} satisfies Meta<typeof FloatingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
