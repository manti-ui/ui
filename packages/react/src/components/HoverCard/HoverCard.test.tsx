import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HoverCard } from './HoverCard';

describe('HoverCard', () => {
  it('renders controlled content and its optional arrow', () => {
    render(
      <HoverCard open trigger={<button type="button">Author</button>}>
        Author details
      </HoverCard>,
    );

    expect(screen.getByText('Author details')).toBeInTheDocument();
    expect(document.querySelector('[data-part="arrow"]')).toBeInTheDocument();
  });
});
