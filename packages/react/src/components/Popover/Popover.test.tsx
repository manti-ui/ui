import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from './Popover';

describe('Popover', () => {
  it('renders a controlled panel and closes with its close trigger', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        open
        title="More information"
        showCloseButton
        onOpenChange={onOpenChange}
        trigger={<button type="button">Info</button>}
      >
        Details
      </Popover>,
    );

    expect(
      screen.getByRole('dialog', { name: 'More information' }),
    ).toHaveTextContent('Details');
    const close = screen.getByRole('button', { name: /close/i });
    fireEvent.click(close);

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});
