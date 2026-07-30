import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from './Alert';

describe('Alert', () => {
  it('renders product actions in a public anatomy part', () => {
    render(
      <Alert
        title="Draft found"
        actions={<button type="button">Restore</button>}
      >
        Continue where you left off.
      </Alert>,
    );

    const action = screen.getByRole('button', { name: 'Restore' });
    expect(action.parentElement).toHaveAttribute('data-part', 'actions');
  });
});
