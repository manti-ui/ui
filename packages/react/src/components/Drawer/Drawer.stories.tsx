import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Drawer } from './Drawer.js';
import { Button } from '../Button/Button.js';
import { Input } from '../Input/Input.js';

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
    trigger: <Button variant="$1">Open drawer</Button>,
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
        <Input label="Name" defaultValue="Kayseri mantı" fullWidth />
        <Input label="Filling" defaultValue="Spiced lamb" fullWidth />
        <Input
          label="Finish"
          defaultValue="Garlic yogurt, mint butter"
          fullWidth
        />
      </div>
    ),
    footer: ({ close }) => (
      <>
        <Button variant="tertiary" onClick={close}>
          Cancel
        </Button>
        <Button variant="$1" onClick={close}>
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
          trigger={<Button variant="tertiary">{placement}</Button>}
        >
          A panel anchored to the {placement} edge of the viewport.
        </Drawer>
      ))}
    </div>
  ),
};

/** `closeLabel` names the corner close button for screen readers. */
export const CustomCloseLabel: Story = {
  args: {
    title: 'Pantry',
    description: 'Flour, lamb, onions, yogurt and dried mint.',
    closeLabel: 'Close pantry',
    trigger: <Button variant="primary">Open pantry</Button>,
  },
};

function FocusTargetsExample() {
  const fillingRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ display: 'flex', gap: 'var(--manti-space-3)' }}>
      <Drawer
        trigger={<Button variant="primary">Edit filling</Button>}
        title="Edit filling"
        description="Focus starts in the filling field and moves to Done when the drawer closes."
        initialFocusEl={() => fillingRef.current}
        finalFocusEl={() => doneRef.current}
        footer={({ close }) => (
          <>
            <Button variant="tertiary" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={close}>
              Save
            </Button>
          </>
        )}
      >
        <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
          <Input label="Name" defaultValue="Kayseri mantı" fullWidth />
          <Input
            ref={fillingRef}
            label="Filling"
            defaultValue="Spiced lamb"
            fullWidth
          />
        </div>
      </Drawer>
      <Button ref={doneRef} variant="tertiary">
        Done
      </Button>
    </div>
  );
}

/**
 * `initialFocusEl` picks the element focused on open and `finalFocusEl` the
 * one focused on close, instead of the first field and the trigger.
 */
export const FocusTargets: Story = {
  render: () => <FocusTargetsExample />,
};
