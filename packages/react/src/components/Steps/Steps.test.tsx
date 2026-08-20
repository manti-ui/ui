import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Steps } from './Steps';

describe('Steps', () => {
  it('moves through step content with the built-in controls', async () => {
    const onStepChange = vi.fn();
    render(
      <Steps
        onStepChange={onStepChange}
        items={[
          { title: 'Account', content: 'Account content' },
          { title: 'Review', content: 'Review content' },
        ]}
      />,
    );

    expect(screen.getByText('Account content')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => expect(onStepChange).toHaveBeenCalledWith(1));
    expect(screen.getByText('Review content')).toBeVisible();
  });
});
