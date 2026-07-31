import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './Menu';

describe('Menu', () => {
  it('selects the clicked item without prior pointer events', () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[{ value: 'profile', label: 'Profile' }]}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith('profile');
  });

  it('selects the pointed item exactly once', () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[{ value: 'profile', label: 'Profile' }]}
        onSelect={onSelect}
      />,
    );

    const item = screen.getByRole('menuitem', { name: 'Profile' });
    fireEvent.pointerMove(item);
    fireEvent.pointerDown(item);
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith('profile');
  });

  it('selects the highlighted item from the keyboard', () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[
          { value: 'profile', label: 'Profile' },
          { value: 'settings', label: 'Settings' },
        ]}
        onSelect={onSelect}
      />,
    );

    const firstItem = screen.getByRole('menuitem', { name: 'Profile' });
    firstItem.focus();
    fireEvent.keyDown(firstItem, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith('profile');
  });

  it('renders checkbox and radio items with checked semantics', () => {
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[
          {
            type: 'checkbox',
            value: 'compact',
            label: 'Compact',
            checked: true,
          },
          {
            type: 'radio',
            value: 'dark',
            label: 'Dark',
            checked: false,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Compact' }),
    ).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('merges item props without losing machine behavior', () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[
          {
            value: 'delete',
            label: 'Delete',
            tone: 'danger',
            itemProps: {
              'aria-label': 'Delete account',
              'data-testid': 'delete-item',
            },
          },
        ]}
        onSelect={onSelect}
      />,
    );

    const item = screen.getByTestId('delete-item');
    expect(item).toHaveAttribute('data-tone', 'danger');
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledWith('delete');
  });

  it('honors a consumer preventing item activation', () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[
          {
            value: 'delete',
            label: 'Delete',
            itemProps: {
              onClick: (event) => event.preventDefault(),
            },
          },
        ]}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
