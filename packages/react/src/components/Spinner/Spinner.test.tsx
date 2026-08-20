import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('announces loading state with its configured size', () => {
    render(<Spinner size="lg" label="Saving" data-testid="spinner" />);

    const spinner = screen.getByRole('status', { name: 'Saving' });
    expect(spinner).toHaveAttribute('data-size', 'lg');
    expect(spinner).toHaveAttribute('data-testid', 'spinner');
  });
});
