import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('toggles pressed state and supports a pressed render function', async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle onPressedChange={onPressedChange} aria-label="Pin">
        {(pressed) => (pressed ? 'Pinned' : 'Pin')}
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'Pin' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);

    await waitFor(() => expect(onPressedChange).toHaveBeenCalledWith(true));
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveTextContent('Pinned');
  });
});
