import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  it('opens a sized time panel from its labelled input', async () => {
    render(<TimePicker label="Start time" size="lg" defaultValue="13:30" />);

    expect(screen.getByRole('textbox', { name: 'Start time' })).toHaveValue(
      '01:30 PM',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }));

    await waitFor(() =>
      expect(
        document.querySelector('[data-scope="time-picker"][data-part="root"]'),
      ).toHaveAttribute('data-state', 'open'),
    );
    expect(document.querySelector('[data-part="positioner"]')).toHaveAttribute(
      'data-size',
      'lg',
    );
  });
});
