import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createToaster } from './Toast';

describe('createToaster', () => {
  it('localizes the close button at factory level', async () => {
    const { toaster, Toaster } = createToaster({
      translations: { closeTriggerLabel: 'Kapat' },
    });
    render(<Toaster />);

    act(() => {
      toaster.create({ title: 'Kaydedildi', closable: true });
    });

    await waitFor(() =>
      expect(
        document.querySelector(
          '[data-scope="toast"][data-part="close-trigger"]',
        ),
      ).toHaveAttribute('aria-label', 'Kapat'),
    );
  });
});
