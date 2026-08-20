import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Combobox } from './Combobox';

describe('Combobox', () => {
  it('filters options and reports the selected value', async () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        label="Country"
        items={[
          { value: 'tr', label: 'Türkiye' },
          { value: 'de', label: 'Germany' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Country' });
    fireEvent.click(screen.getByRole('button', { name: 'Toggle options' }));
    fireEvent.change(input, { target: { value: 'ger' } });

    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Germany' })).toBeVisible(),
    );
    expect(
      screen.queryByRole('option', { name: 'Türkiye' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Germany' }));
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(['de']));
  });
});
