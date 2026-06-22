import type { Meta, StoryObj } from '@storybook/react-vite';

import { Drawer } from './Drawer';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    title: 'Edit recipe',
    description: 'Adjust the filling and the finish, then save.',
    placement: 'right',
    size: 'md',
    showCloseButton: true,
    trigger: <Button tone="primary">Open drawer</Button>,
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <TextField label="Name" defaultValue="Kayseri mantı" fullWidth />
        <TextField label="Filling" defaultValue="Spiced lamb" fullWidth />
        <TextField label="Finish" defaultValue="Garlic yogurt, mint butter" fullWidth />
      </div>
    ),
    footer: ({ close }) => (
      <>
        <Button variant="ghost" onClick={close}>
          Cancel
        </Button>
        <Button tone="primary" onClick={close}>
          Save
        </Button>
      </>
    ),
  },
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      {(['left', 'right', 'top', 'bottom'] as const).map((placement) => (
        <Drawer
          key={placement}
          placement={placement}
          title={`From the ${placement}`}
          description={`This drawer slides in from the ${placement} edge.`}
          trigger={<Button variant="outline">{placement}</Button>}
        >
          A panel anchored to the {placement} edge of the viewport.
        </Drawer>
      ))}
    </div>
  ),
};
