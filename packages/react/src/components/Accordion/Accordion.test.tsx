import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('opens an item and reports the open value', async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion
        items={[{ value: 'details', title: 'Details', content: 'More info' }]}
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.focus(trigger);
    fireEvent.click(trigger);

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    expect(screen.getByText('More info')).toBeVisible();
    expect(onValueChange).toHaveBeenCalledWith(['details']);
  });
});
