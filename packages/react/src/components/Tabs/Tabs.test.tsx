import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('switches the selected tab and its visible panel', async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        onValueChange={onValueChange}
        items={[
          { value: 'overview', label: 'Overview', content: 'Overview panel' },
          { value: 'activity', label: 'Activity', content: 'Activity panel' },
        ]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }));

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('activity'));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });
});
