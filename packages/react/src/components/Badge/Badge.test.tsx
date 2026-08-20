import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its variant, size, and optional status dot', () => {
    render(
      <Badge variant="success" size="md" dot>
        Ready
      </Badge>,
    );

    const badge = screen.getByText('Ready');
    expect(badge).toHaveAttribute('data-scope', 'badge');
    expect(badge).toHaveAttribute('data-variant', 'success');
    expect(badge).toHaveAttribute('data-size', 'md');
    expect(badge.querySelector('[data-part="dot"]')).toBeInTheDocument();
  });

  it('forwards refs and native props through the polymorphic root', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Badge as="a" href="/status" ref={ref}>
        Status
      </Badge>,
    );

    expect(ref.current).toBe(screen.getByRole('link', { name: 'Status' }));
  });
});
