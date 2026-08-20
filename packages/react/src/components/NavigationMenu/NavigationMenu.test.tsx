import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NavigationMenu } from './NavigationMenu';

describe('NavigationMenu', () => {
  it('opens a menu and exposes its links', async () => {
    const onValueChange = vi.fn();
    render(
      <NavigationMenu
        onValueChange={onValueChange}
        items={[
          {
            value: 'guides',
            label: 'Guides',
            links: [
              {
                href: '/getting-started',
                label: 'Getting started',
                description: 'Learn the basics',
              },
            ],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Guides' }));

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith('guides'));
    expect(
      screen.getByRole('link', { name: /Getting started/ }),
    ).toHaveAttribute('href', '/getting-started');
  });
});
