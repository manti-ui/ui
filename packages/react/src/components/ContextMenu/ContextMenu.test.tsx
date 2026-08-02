import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
  it('renders the declarative items shorthand around its target region', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu
        defaultOpen
        items={[{ value: 'copy', label: 'Copy', shortcut: '⌘C' }]}
        onSelect={onSelect}
      >
        <p>Right-click me</p>
      </ContextMenu>,
    );

    expect(screen.getByText('Right-click me')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: /Copy/ }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('copy');
  });

  it('opens nested items with the same declarative model', async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu
        defaultOpen
        onSelect={onSelect}
        items={[
          {
            type: 'submenu',
            value: 'share',
            label: 'Share',
            items: [{ value: 'copy-link', label: 'Copy link' }],
          },
        ]}
      >
        <p>Right-click me</p>
      </ContextMenu>,
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
    await screen.findByRole('menuitem', { name: 'Copy link' });
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy link' }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('copy-link');
  });
});
