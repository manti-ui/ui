import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog.js';

// jsdom has no layout, so every element reports a zero size and the dialog's
// focus trap treats it as hidden. Give elements a size so the trap can focus.
function giveElementsLayout() {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1);
}

describe('Dialog', () => {
  it('renders render-prop slots and lets a footer action close it', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        defaultOpen
        title="Confirm change"
        description="This updates the profile."
        onOpenChange={onOpenChange}
        children={({ close }) => (
          <button type="button" onClick={close}>
            Cancel
          </button>
        )}
        footer={({ close }) => (
          <button type="button" onClick={close}>
            Close from footer
          </button>
        )}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: 'Confirm change' }),
    ).toHaveTextContent('This updates the profile.');
    fireEvent.click(screen.getByRole('button', { name: 'Close from footer' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('names the close trigger "Close" by default', () => {
    render(<Dialog defaultOpen title="Settings" />);

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('uses closeLabel as the close trigger name', () => {
    render(
      <Dialog defaultOpen title="Settings" closeLabel="Dismiss settings" />,
    );

    expect(
      screen.getByRole('button', { name: 'Dismiss settings' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('focuses the element initialFocusEl returns when it opens', async () => {
    giveElementsLayout();
    function Example() {
      const nameRef = useRef<HTMLInputElement>(null);
      return (
        <Dialog
          trigger={<button type="button">Edit profile</button>}
          title="Profile"
          initialFocusEl={() => nameRef.current}
        >
          <button type="button">Help</button>
          <input ref={nameRef} aria-label="Name" />
        </Dialog>
      );
    }
    render(<Example />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus(),
    );
  });

  it('focuses the close trigger of an alertdialog by default', async () => {
    giveElementsLayout();
    render(
      <Dialog
        role="alertdialog"
        trigger={<button type="button">Delete</button>}
        title="Delete project?"
      >
        {/* Would take focus if the machine's alertdialog default were lost. */}
        <button type="button" data-autofocus>
          Confirm
        </button>
      </Dialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus(),
    );
  });
});
