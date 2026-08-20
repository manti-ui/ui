import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tour } from './Tour';

describe('Tour', () => {
  it('starts a targetless tour and advances to the next step', async () => {
    render(
      <Tour
        trigger={<button type="button">Start tour</button>}
        steps={[
          { id: 'intro', title: 'Welcome', description: 'First step' },
          { id: 'finish', title: 'Finish', description: 'Last step' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start tour' }));
    await waitFor(() =>
      expect(screen.getByText('Welcome')).toBeInTheDocument(),
    );
    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByText('Finish')).toBeInTheDocument());
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
  });
});
