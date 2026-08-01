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

  it('renders composed parts when items is omitted', () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu defaultOpen onSelect={onSelect}>
        <ContextMenu.Trigger>
          <p>Right-click me</p>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    expect(screen.getByText('Right-click me')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('copy');
  });
});
