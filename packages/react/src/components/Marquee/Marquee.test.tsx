import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('duplicates its content and exposes motion configuration', () => {
    render(
      <Marquee direction="up" speed={12} pauseOnHover={false} gap="lg">
        Announcement
      </Marquee>,
    );

    const root = screen
      .getAllByText('Announcement')[0]
      .closest('[data-part="root"]');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root).toHaveAttribute('data-direction', 'up');
    expect(root).toHaveAttribute('data-gap', 'lg');
    expect(root).not.toHaveAttribute('data-pause-on-hover');
    expect(screen.getAllByText('Announcement')).toHaveLength(2);
    expect(screen.getAllByText('Announcement')[1]).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
