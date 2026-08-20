import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Blockquote } from './Blockquote';

describe('Blockquote', () => {
  it('keeps native quotation semantics and forwards its ref', () => {
    const ref = createRef<HTMLQuoteElement>();
    render(
      <Blockquote ref={ref} cite="https://example.com" size="lg">
        Make the right thing easy.
      </Blockquote>,
    );

    const quote = screen.getByText('Make the right thing easy.');
    expect(quote).toBe(ref.current);
    expect(quote).toHaveAttribute('cite', 'https://example.com');
    expect(quote).toHaveAttribute('data-size', 'lg');
  });
});
