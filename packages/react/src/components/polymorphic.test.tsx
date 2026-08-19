import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge/Badge';
import { Card } from './Card/Card';
import { Heading } from './Heading/Heading';
import { Text } from './Text/Text';

describe('polymorphic primitives', () => {
  it('forwards Badge props and ref to the selected root', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Badge as="a" href="/status" ref={ref}>
        Stable
      </Badge>,
    );

    expect(ref.current).toBe(screen.getByRole('link', { name: 'Stable' }));
    expect(ref.current).toHaveAttribute('href', '/status');
  });

  it('forwards Card props and ref to the selected root', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Card as="article" ref={ref} aria-label="Release notes">
        Content
      </Card>,
    );

    expect(ref.current).toBe(
      screen.getByRole('article', { name: 'Release notes' }),
    );
  });

  it('forwards Text props and ref to the selected root', () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <Text as="label" htmlFor="email" ref={ref} emphasis="muted">
        Email
      </Text>,
    );

    expect(ref.current).toBe(screen.getByText('Email'));
    expect(ref.current).toHaveAttribute('for', 'email');
  });

  it('forwards Heading props and ref to the selected root', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading level={3} ref={ref} id="anatomy">
        Anatomy
      </Heading>,
    );

    expect(ref.current).toBe(screen.getByRole('heading', { level: 3 }));
    expect(ref.current).toHaveAttribute('id', 'anatomy');
  });
});
