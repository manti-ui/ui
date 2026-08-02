import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Blockquote } from './Blockquote/Blockquote';
import { Code } from './Code/Code';
import { Kbd } from './Kbd/Kbd';

describe('typography primitives', () => {
  it('renders Kbd with native semantics, props, and ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd ref={ref} title="Command key">
        ⌘
      </Kbd>,
    );

    expect(ref.current?.tagName).toBe('KBD');
    expect(ref.current).toHaveAttribute('title', 'Command key');
    expect(ref.current).toHaveAttribute('data-size', 'sm');
  });

  it('renders Code as inline code and forwards native props', () => {
    render(<Code aria-label="package name">@manti-ui/react</Code>);

    const code = screen.getByLabelText('package name');
    expect(code.tagName).toBe('CODE');
    expect(code).toHaveAttribute('data-scope', 'code');
  });

  it('renders Blockquote with its native cite attribute', () => {
    render(
      <Blockquote cite="https://example.com/source" size="lg">
        Good tools make the right thing easy.
      </Blockquote>,
    );

    const quote = screen.getByText('Good tools make the right thing easy.');
    expect(quote.tagName).toBe('BLOCKQUOTE');
    expect(quote).toHaveAttribute('cite', 'https://example.com/source');
    expect(quote).toHaveAttribute('data-size', 'lg');
  });
});
