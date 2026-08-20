import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  it('accepts a selected file and renders it in the list', async () => {
    const onFilesChange = vi.fn();
    const { container } = render(
      <FileUpload label="Attachments" onFilesChange={onFilesChange} />,
    );
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]');

    expect(input).toBeInTheDocument();
    fireEvent.input(input!, { target: { files: [file] } });

    await waitFor(() => expect(onFilesChange).toHaveBeenCalledWith([file]));
    expect(screen.getByText('notes.txt')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove notes.txt' }),
    ).toBeInTheDocument();
  });
});
