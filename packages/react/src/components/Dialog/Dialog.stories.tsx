import { useRef } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Dialog } from './Dialog.js';
import type { DialogProps } from './Dialog.js';
import { Button } from '../Button/Button.js';
import { Input } from '../Input/Input.js';

export default {
  title: 'Components/Dialog',
  args: {
    title: 'Freeze a batch?',
    description:
      'Raw mantı freeze beautifully. Lay them on a floured tray, freeze solid, then bag them.',
    size: 'md',
    trigger: <Button variant="$1">Open dialog</Button>,
    children:
      'They keep for up to three months and cook straight from frozen — just add a minute to the boil.',
  },
  meta: { layout: 'centered' },
} satisfies StoryDefault<DialogProps>;

export const Playground: Story<DialogProps> = (args) => <Dialog {...args} />;
Playground.args = {
  footer: ({ close }) => (
    <>
      <Button variant="tertiary" onClick={close}>
        Cancel
      </Button>
      <Button variant="$1" onClick={close}>
        Freeze them
      </Button>
    </>
  ),
};

export const AlertDialog: Story<DialogProps> = (args) => <Dialog {...args} />;
AlertDialog.args = {
  role: 'alertdialog',
  title: 'Discard this filling?',
  description: 'Your unsaved recipe changes will be lost.',
  size: 'sm',
  trigger: <Button variant="$1">Discard</Button>,
  children: null,
  footer: ({ close }) => (
    <>
      <Button variant="tertiary" onClick={close}>
        Keep editing
      </Button>
      <Button variant="$1" onClick={close}>
        Discard
      </Button>
    </>
  ),
};

/** `closeLabel` names the corner close button for screen readers. */
export const CustomCloseLabel: Story<DialogProps> = (args) => (
  <Dialog {...args} />
);
CustomCloseLabel.args = {
  title: 'Cooking times',
  description: 'Boil fresh mantı for four minutes, frozen for five.',
  closeLabel: 'Close cooking times',
  trigger: <Button variant="primary">Show cooking times</Button>,
  children: null,
};

function FocusTargetsExample() {
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ display: 'flex', gap: 'var(--manti-space-3)' }}>
      <Dialog
        trigger={<Button variant="primary">Rename batch</Button>}
        title="Rename batch"
        description="Focus starts in the name field and moves to Done when the dialog closes."
        initialFocusEl={() => nameRef.current}
        finalFocusEl={() => doneRef.current}
        footer={({ close }) => (
          <>
            <Button variant="tertiary" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={close}>
              Rename
            </Button>
          </>
        )}
      >
        <Input
          ref={nameRef}
          label="Batch name"
          defaultValue="Sunday batch"
          fullWidth
        />
      </Dialog>
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
export const FocusTargets: Story<DialogProps> = () => <FocusTargetsExample />;
