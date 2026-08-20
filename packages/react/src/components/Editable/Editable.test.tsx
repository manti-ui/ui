import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Editable } from './Editable';

describe('Editable', () => {
  it('enters edit mode and commits the edited value', async () => {
    const onValueCommit = vi.fn();
    render(
      <Editable
        label="Project name"
        defaultValue="Draft"
        activationMode="click"
        onValueCommit={onValueCommit}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /edit/i }));
    const input = await screen.findByRole('textbox', {
      name: 'editable input',
    });
    await user.clear(input);
    await user.type(input, 'Published');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() =>
      expect(onValueCommit).toHaveBeenCalledWith('Published'),
    );
    expect(screen.getByText('Published')).toBeVisible();
  });
});
