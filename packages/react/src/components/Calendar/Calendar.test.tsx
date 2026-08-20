import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('renders a labelled month grid with custom day content', () => {
    render(
      <Calendar
        locale="en-US"
        actions={<button type="button">View</button>}
        renderDay={(day) => (day.day === 1 ? 'Event' : null)}
      />,
    );

    const root = screen
      .getAllByText('Event')[0]
      .closest('[data-scope="calendar"]');
    expect(root).toHaveAttribute('data-part', 'day-content');
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Previous month' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next month' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument();
  });
});
