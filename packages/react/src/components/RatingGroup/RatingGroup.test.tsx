import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RatingGroup } from './RatingGroup';

describe('RatingGroup', () => {
  it('renders the requested number of ratings and emits the selection', async () => {
    const onValueChange = vi.fn();
    render(
      <RatingGroup
        count={5}
        label="Satisfaction"
        onValueChange={onValueChange}
      />,
    );

    const ratings = screen.getAllByRole('radio');
    expect(ratings).toHaveLength(5);
    fireEvent.click(ratings[3]);

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(4));
  });
});
