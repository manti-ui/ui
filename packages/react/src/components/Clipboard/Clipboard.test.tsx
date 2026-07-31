import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useClipboard } from './Clipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('exposes headless copy state and actions', async () => {
    const { result } = renderHook(() =>
      useClipboard({ value: 'https://kamp.us' }),
    );

    act(() => result.current.copy());

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://kamp.us',
      ),
    );
    await waitFor(() => expect(result.current.copied).toBe(true));
  });
});
