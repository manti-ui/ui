import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './Select';

describe('Select', () => {
  it('opens its portalled listbox and selects an item', async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="Status"
        size="sm"
        placeholder="Choose status"
        items={[
          { value: 'todo', label: 'To do' },
          { value: 'done', label: 'Done' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Status' });
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible());
    expect(document.querySelector('[data-part="positioner"]')).toHaveAttribute(
      'data-size',
      'sm',
    );

    fireEvent.click(screen.getByRole('option', { name: 'Done' }));
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(['done']));
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'Done',
    );
  });

  it('supports an accessible name without adding a layout label', () => {
    render(
      <Select
        aria-label="Code styling"
        items={[{ value: 'tailwind', label: 'Tailwind' }]}
        defaultValue={['tailwind']}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: 'Code styling' });
    expect(trigger).toHaveAttribute('aria-label', 'Code styling');
    expect(trigger).not.toHaveAttribute('aria-labelledby');
    expect(
      trigger
        .closest('[data-part="root"]')
        ?.querySelector('[data-part="label"]'),
    ).toBeNull();
  });
});
