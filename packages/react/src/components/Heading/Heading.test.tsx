import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';

describe('Heading', () => {
  it('keeps the semantic level independent from its visual size', () => {
    render(
      <Heading level={4} size="2xl/regular" variant="primary">
        Section
      </Heading>,
    );

    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toHaveAttribute('data-level', '4');
    expect(heading).toHaveAttribute('data-size', '2xl');
    expect(heading).toHaveAttribute('data-weight', 'regular');
    expect(heading).toHaveAttribute('data-variant', 'primary');
  });
});
