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
    trigger: <Button variant="secondary">Tips</Button>,
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

export const Placements: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
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
  ),
};
