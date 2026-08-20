import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PinInput } from './PinInput';

describe('PinInput', () => {
  it('renders the requested cells and completes a numeric code', async () => {
    const onValueComplete = vi.fn();
    render(
      <PinInput
        length={4}
        label="Verification code"
        type="numeric"
        onValueComplete={onValueComplete}
      />,
    );

    const inputs = screen.getAllByRole('textbox', { name: /pin code/i });
    expect(inputs).toHaveLength(4);
    await userEvent.setup().type(inputs[0], '1234');

    await waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith(
        ['1', '2', '3', '4'],
        '1234',
      ),
    );
  });
});
