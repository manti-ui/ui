import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TagsInput } from './TagsInput';

describe('TagsInput', () => {
  it('renders tags and removes one through its delete trigger', async () => {
    const onValueChange = vi.fn();
    render(
      <TagsInput
        label="Topics"
        defaultValue={['design', 'testing']}
        onValueChange={onValueChange}
      />,
    );

    expect(screen.getByText('design')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove design' }));

    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith(['testing']),
    );
    expect(screen.queryByText('design')).not.toBeInTheDocument();
  });
});
