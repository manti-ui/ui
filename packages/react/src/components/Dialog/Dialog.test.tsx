import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog';

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
});
