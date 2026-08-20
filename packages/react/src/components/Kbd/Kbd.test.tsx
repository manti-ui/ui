import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Kbd } from './Kbd';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Kbd', () => {
  it('renders the native kbd element and forwards attributes', () => {
    render(
      <Kbd size="md" aria-label="shortcut">
        ⌘K
      </Kbd>,
    );

    const key = screen.getByLabelText('shortcut');
    expect(key.tagName).toBe('KBD');
    expect(key).toHaveAttribute('data-scope', 'kbd');
    expect(key).toHaveAttribute('data-size', 'md');
  });

  it('renders Ctrl for the command symbol on non-Mac platforms', () => {
    vi.stubGlobal('navigator', { platform: 'Win32', userAgent: '' });

    render(<Kbd>⌘</Kbd>);

    expect(screen.getByText('Ctrl')).toBeInTheDocument();
  });

  it('keeps the command symbol on Mac platforms', () => {
    vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: '' });

    render(<Kbd>⌘</Kbd>);

    expect(screen.getByText('⌘')).toBeInTheDocument();
  });
});
