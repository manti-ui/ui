import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('renders slides and advances through its next control', async () => {
    const onPageChange = vi.fn();
    render(
      <Carousel
        slides={['First', 'Second', 'Third']}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /slide/i })).toHaveLength(5);

    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    await waitFor(() => expect(onPageChange).toHaveBeenCalledWith(1));
  });
});
