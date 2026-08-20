import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Code } from './Code';

describe('Code', () => {
  it('renders semantic inline code with size and ref forwarding', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Code ref={ref} size="md" aria-label="code">
        pnpm test
      </Code>,
    );

    const code = screen.getByLabelText('code');
    expect(code).toBe(ref.current);
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveAttribute('data-size', 'md');
  });
});
