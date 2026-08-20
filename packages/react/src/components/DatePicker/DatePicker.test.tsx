import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('connects its labelled input to a portalled calendar', async () => {
    render(
      <DatePicker label="Start date" size="lg" defaultValue={['2026-08-20']} />,
    );

    const input = screen.getByRole('textbox', { name: 'Start date' });
    expect(input).toHaveValue('08/20/2026');

    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Open calendar' }),
      ).toHaveAttribute('aria-expanded', 'true'),
    );
    expect(screen.getByRole('grid')).toBeVisible();
    expect(document.querySelector('[data-part="positioner"]')).toHaveAttribute(
      'data-size',
      'lg',
    );
  });
});
