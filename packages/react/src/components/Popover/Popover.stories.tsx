import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popover } from './Popover';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    title: 'Dough resting',
    placement: 'bottom',
    showArrow: true,
    trigger: <Button variant="soft">Tips</Button>,
    children:
      'Let the dough rest, covered, for 30 minutes. It relaxes the gluten so you can roll it paper-thin without it springing back.',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithCloseButton: Story = {
  args: { showCloseButton: true },
};

export const TopPlacement: Story = {
  args: { placement: 'top' },
};
