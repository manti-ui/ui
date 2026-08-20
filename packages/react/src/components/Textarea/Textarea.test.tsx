import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('connects labels and described error text to the real textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <Textarea ref={ref} label="Notes" error="Notes are required" required />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toBe(ref.current);
    expect(textarea).toBeInvalid();
    expect(textarea).toHaveAccessibleDescription('Notes are required');
    expect(screen.getByText('Notes are required')).toHaveAttribute(
      'data-part',
      'error',
    );
  });
});
