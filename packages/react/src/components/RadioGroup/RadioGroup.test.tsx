import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('selects one option and reports its value', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Theme"
        items={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const dark = screen.getByRole('radio', { name: 'Dark' });
    fireEvent.click(dark);

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('dark'));
    expect(dark).toBeChecked();
  });
});
