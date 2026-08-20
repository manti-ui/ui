import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders the selected placement and closes through its slot action', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer
        defaultOpen
        placement="left"
        size="lg"
        title="Navigation"
        onOpenChange={onOpenChange}
        children={({ close }) => (
          <button type="button" onClick={close}>
            Done
          </button>
        )}
      />,
    );

    const drawer = screen.getByRole('dialog', { name: 'Navigation' });
    expect(drawer).toHaveAttribute('data-placement', 'left');
    expect(drawer).toHaveAttribute('data-size', 'lg');

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
