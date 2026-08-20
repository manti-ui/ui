import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders a focusable viewport and wakes auto scrollbars on activity', () => {
    render(
      <ScrollArea orientation="both" type="auto">
        Content
      </ScrollArea>,
    );

    const root = screen.getByText('Content').closest('[data-part="root"]');
    const viewport = screen.getByRole('group');
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(root?.querySelectorAll('[data-part="scrollbar"]')).toHaveLength(2);

    fireEvent.pointerMove(root!);
    expect(root).toHaveAttribute('data-active', 'true');
  });
});
