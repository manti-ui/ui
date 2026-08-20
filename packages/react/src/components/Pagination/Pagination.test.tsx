import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders page buttons and reports next-page navigation', async () => {
    const onPageChange = vi.fn();
    render(<Pagination count={50} pageSize={10} onPageChange={onPageChange} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    await waitFor(() => expect(onPageChange).toHaveBeenCalledWith(2));
  });
});
