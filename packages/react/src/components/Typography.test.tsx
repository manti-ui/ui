import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Blockquote } from './Blockquote/Blockquote';
import { Code } from './Code/Code';
import { Heading } from './Heading/Heading';
import { Kbd } from './Kbd/Kbd';
import { Text } from './Text/Text';

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

describe('Text', () => {
  it('renders a paragraph with the scale and emphasis attributes', () => {
    render(
      <Text size="lg/semibold" emphasis="muted" align="center">
        Body copy
      </Text>,
    );

    const text = screen.getByText('Body copy');
    expect(text.tagName).toBe('P');
    expect(text).toHaveAttribute('data-scope', 'text');
    expect(text).toHaveAttribute('data-size', 'lg');
    expect(text).toHaveAttribute('data-weight', 'semibold');
    expect(text).toHaveAttribute('data-emphasis', 'muted');
    expect(text).toHaveAttribute('data-align', 'center');
  });

  it('splits a bare size into the stop with no weight attribute', () => {
    render(<Text size="xl">Bare stop</Text>);

    const text = screen.getByText('Bare stop');
    expect(text).toHaveAttribute('data-size', 'xl');
    expect(text).not.toHaveAttribute('data-weight');
  });

  it('omits data-emphasis at the default rung and data-variant when neutral', () => {
    render(<Text>Neutral</Text>);

    const text = screen.getByText('Neutral');
    expect(text).not.toHaveAttribute('data-emphasis');
    expect(text).not.toHaveAttribute('data-variant');
  });

  it('keeps emphasis and variant as independent axes', () => {
    render(
      <Text emphasis="muted" variant="danger">
        Quiet danger
      </Text>,
    );

    const text = screen.getByText('Quiet danger');
    expect(text).toHaveAttribute('data-emphasis', 'muted');
    expect(text).toHaveAttribute('data-variant', 'danger');
  });

  it('drives the line clamp through a private custom property', () => {
    render(<Text lineClamp={3}>Clamped</Text>);

    const text = screen.getByText('Clamped');
    expect(text).toHaveAttribute('data-line-clamp', '3');
    expect(text.style.getPropertyValue('--_line-clamp')).toBe('3');
  });

  it('lets lineClamp win over truncate', () => {
    render(
      <Text truncate lineClamp={2}>
        Both
      </Text>,
    );

    const text = screen.getByText('Both');
    expect(text).toHaveAttribute('data-line-clamp', '2');
    expect(text).not.toHaveAttribute('data-truncate');
  });

  it('renders as another element and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Text as="span" ref={ref}>
        Inline
      </Text>,
    );

    expect(ref.current?.tagName).toBe('SPAN');
  });
});

describe('Heading', () => {
  it('maps the level onto the matching heading element', () => {
    render(<Heading level={3}>Section</Heading>);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading.tagName).toBe('H3');
    expect(heading).toHaveAttribute('data-scope', 'heading');
    expect(heading).toHaveAttribute('data-level', '3');
  });

  it('defaults to an h2 at the 2xl stop', () => {
    render(<Heading>Default</Heading>);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('data-size', '2xl');
  });

  it('keeps the semantic level independent of the visual size', () => {
    render(
      <Heading level={2} size="sm">
        Eyebrow
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('data-level', '2');
    expect(heading).toHaveAttribute('data-size', 'sm');
  });

  it('omits data-weight so the level-1 default can apply', () => {
    render(<Heading level={1}>Hero</Heading>);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).not.toHaveAttribute('data-weight');
    expect(heading).toHaveAttribute('data-level', '1');
  });

  it('lets a compound size override the level-1 weight default', () => {
    render(
      <Heading level={1} size="4xl/regular">
        Quiet hero
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('data-size', '4xl');
    expect(heading).toHaveAttribute('data-weight', 'regular');
  });

  it('lets `as` override the element while keeping the styling rank', () => {
    render(
      <Heading as="div" level={4}>
        Visual only
      </Heading>,
    );

    const heading = screen.getByText('Visual only');
    expect(heading.tagName).toBe('DIV');
    expect(heading).toHaveAttribute('data-level', '4');
  });
});
