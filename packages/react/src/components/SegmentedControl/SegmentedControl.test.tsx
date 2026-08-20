import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('uses single-selection radio semantics for its segments', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        size="lg"
        items={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    const root = document.querySelector(
      '[data-part="root"][data-scope="segmented-control"]',
    );
    expect(root).toHaveAttribute('data-size', 'lg');
    fireEvent.click(screen.getByRole('radio', { name: 'Week' }));

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('week'));
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });
});
