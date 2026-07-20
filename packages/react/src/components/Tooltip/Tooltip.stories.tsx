import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    content: 'Backed by a Zag.js machine',
    children: <Button variant="secondary">Hover or focus me</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Delayed: Story = {
  args: { openDelay: 0, closeDelay: 0 },
};
