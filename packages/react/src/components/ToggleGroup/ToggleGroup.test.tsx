import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ToggleGroup } from './ToggleGroup';

describe('ToggleGroup', () => {
  it('supports scalar single selection and an accessible group name', async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        type="single"
        items={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        rootProps={{ 'aria-label': 'Theme' }}
        onValueChange={onValueChange}
      />,
    );

    expect(
      screen.getByRole('radiogroup', { name: 'Theme' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('dark'));
  });
});
