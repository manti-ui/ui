import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Slider } from './Slider';

describe('Slider', () => {
  it('renders marks and updates its value from the keyboard', async () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        label="Volume"
        min={0}
        max={10}
        step={1}
        defaultValue={4}
        marks={[0, 5, 10]}
        showValue
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole('slider', { hidden: true });
    expect(slider).toHaveAttribute('aria-valuenow', '4');
    expect(screen.getByText('4')).toBeInTheDocument();

    fireEvent.focus(slider);
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith([5]));
  });
});
