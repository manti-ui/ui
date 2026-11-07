import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl.js';

const items = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
];

describe('SegmentedControl', () => {
  it('uses single-selection radio semantics for its segments', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        size="lg"
        items={items}
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

  it('names the group from an aria-label passed through rootProps', () => {
    render(
      <SegmentedControl
        items={items}
        rootProps={{ 'aria-label': 'Calendar range' }}
      />,
    );

    expect(
      screen.getByRole('radiogroup', { name: 'Calendar range' }),
    ).toBeInTheDocument();
  });

  it('lets a consumer aria-labelledby win over the machine default', () => {
    render(
      <>
        <span id="range-heading">Calendar range</span>
        <SegmentedControl
          items={items}
          rootProps={{ 'aria-labelledby': 'range-heading' }}
        />
      </>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Calendar range' });
    expect(group).toHaveAttribute('aria-labelledby', 'range-heading');
  });

  it('keeps its own root attributes when rootProps are passed', () => {
    render(
      <SegmentedControl
        size="sm"
        variant="danger"
        className="consumer-class"
        items={items}
        rootProps={{
          'aria-label': 'Calendar range',
          className: 'root-class',
          'data-testid': 'segmented-root',
        }}
      />,
    );

    const root = screen.getByTestId('segmented-root');
    expect(root).toHaveAttribute('data-scope', 'segmented-control');
    expect(root).toHaveAttribute('data-part', 'root');
    expect(root).toHaveAttribute('data-size', 'sm');
    expect(root).toHaveAttribute('data-variant', 'danger');
    expect(root).toHaveClass('consumer-class');
    expect(root).toHaveClass('root-class');
  });
});
