import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { createToaster } from './Toast';
import type { ToastPlacement } from './Toast';
import { Button } from '../Button/Button';

interface ToastDemoProps {
  /** Allow swiping a toast toward its anchored edge to dismiss it. */
  swipe: boolean;
  /** Corner the stack is anchored to (also drives the swipe direction). */
  placement: ToastPlacement;
}

/**
 * Story harness: rebuilds the toaster whenever the `swipe` / `placement`
 * controls change so both can be exercised from the Storybook Controls panel.
 */
function ToastDemo({ swipe, placement }: ToastDemoProps) {
  const { toaster, Toaster } = useMemo(
    () => createToaster({ placement, swipe }),
    [placement, swipe],
  );

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button
          onClick={() =>
            toaster.create({
              title: 'Mantı boiling',
              description:
                'They float when they are ready — about four minutes.',
            })
          }
        >
          Default
        </Button>
        <Button
          tone="success"
          onClick={() =>
            toaster.success({
              title: 'Saved',
              description: 'Your recipe is in the cookbook.',
            })
          }
        >
          Success
        </Button>
        <Button
          tone="danger"
          onClick={() =>
            toaster.error({
              title: 'Dough too dry',
              description: 'Add a splash of water and knead again.',
            })
          }
        >
          Error
        </Button>
        <Button
          tone="warning"
          onClick={() =>
            toaster.warning({
              title: 'Low on dough',
              description: 'Only two bags left in the pantry.',
            })
          }
        >
          Warning
        </Button>
        <Button
          tone="info"
          onClick={() =>
            toaster.info({ title: 'Tip', description: 'Rest the dough first.' })
          }
        >
          Info
        </Button>
      </div>
      <span style={{ color: 'var(--manti-text-subtle)', fontSize: 12 }}>
        {swipe
          ? 'Swipe a toast toward its anchored edge to dismiss it.'
          : 'Swipe disabled — use the close button.'}
      </span>
      <Toaster />
    </div>
  );
}

const meta = {
  title: 'Components/Toast',
  component: ToastDemo,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    swipe: true,
    placement: 'bottom-end',
  },
  argTypes: {
    swipe: { control: 'boolean' },
    placement: {
      control: 'select',
      options: [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ],
    },
  },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Toggle `swipe` and change `placement` from the Controls panel to test. */
export const Playground: Story = {};
