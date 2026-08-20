import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SignaturePad } from './SignaturePad';

describe('SignaturePad', () => {
  it('renders initial paths and clears them through its action', async () => {
    render(
      <SignaturePad
        label="Signature"
        defaultPaths={['M1 1 L2 2']}
        clearLabel="Clear signature"
      />,
    );

    expect(screen.getByText('Signature')).toBeInTheDocument();
    expect(
      document.querySelector('[data-part="segment-path"]'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear signature/i }));
    await waitFor(() =>
      expect(
        document.querySelector('[data-part="segment-path"]'),
      ).not.toBeInTheDocument(),
    );
  });
});
