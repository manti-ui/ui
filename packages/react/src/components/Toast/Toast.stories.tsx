import { useMemo } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { createToaster } from './Toast.js';
import type { ToastPlacement } from './Toast.js';
import { Button } from '../Button/Button.js';

interface ToastDemoProps {
  /** Allow swiping a toast toward its anchored edge to dismiss it. */
  swipe: boolean;
  /** Corner the stack is anchored to (also drives the swipe direction). */
  placement: ToastPlacement;
}

/**
 * Story harness: rebuilds the toaster whenever the `swipe` / `placement`
 * controls change so both can be exercised from the controls panel.
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
          variant="success"
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
          variant="danger"
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
          variant="primary"
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
          variant="info"
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

export default {
  title: 'Components/Toast',
  args: {
    swipe: true,
    placement: 'bottom-end',
  },
  argTypes: {
    swipe: { control: { type: 'boolean' } },
    placement: {
      control: { type: 'select' },
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
  meta: { layout: 'centered' },
} satisfies StoryDefault<ToastDemoProps>;

/** Toggle `swipe` and change `placement` from the Controls panel to test. */
export const Playground: Story<ToastDemoProps> = (args) => (
  <ToastDemo {...args} />
);
