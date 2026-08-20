import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Listbox } from './Listbox';

describe('Listbox', () => {
  it('selects an option and forwards the selected values', async () => {
    const onValueChange = vi.fn();
    render(
      <Listbox
        label="Language"
        items={[
          { value: 'tr', label: 'Turkish' },
          { value: 'en', label: 'English' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('option', { name: 'English' }));

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(['en']));
    expect(screen.getByRole('option', { name: 'English' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
