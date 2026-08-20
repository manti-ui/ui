import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FloatingPanel } from './FloatingPanel';

describe('FloatingPanel', () => {
  it('renders its body and closes through the machine control', async () => {
    const onOpenChange = vi.fn();
    render(
      <FloatingPanel
        defaultOpen
        title="Inspector"
        onOpenChange={onOpenChange}
        trigger={<button type="button">Open inspector</button>}
      >
        Panel body
      </FloatingPanel>,
    );

    expect(screen.getByText('Inspector')).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() =>
      expect(screen.queryByText('Panel body')).not.toBeInTheDocument(),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
