import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Collapsible } from './Collapsible';

describe('Collapsible', () => {
  it('toggles content and exposes the open callback', async () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible trigger="Show details" onOpenChange={onOpenChange}>
        Details
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Show details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    expect(screen.getByText('Details')).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
