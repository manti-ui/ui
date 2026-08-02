import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    fireEvent.pointerMove(item, { pointerType: 'mouse' });
    fireEvent.pointerDown(item, { pointerType: 'mouse' });
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith('profile');
  });

  it('selects the highlighted item from the keyboard', async () => {
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

    // Focus stays on the menu itself — items are tracked with
    // `aria-activedescendant`, so keys are handled by the panel.
    const content = screen.getByRole('menu');
    fireEvent.keyDown(content, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(content).toHaveAttribute('aria-activedescendant'),
    );
    fireEvent.keyDown(content, { key: 'Enter' });

    // The machine activates the highlighted item through a real click, queued
    // on a microtask.
    await waitFor(() => expect(onSelect).toHaveBeenCalledOnce());
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

  it('reports selection to the root and the command', () => {
    const onSelect = vi.fn();
    const onItemSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        onSelect={onSelect}
        items={[
          {
            value: 'yogurt',
            label: 'Garlic yogurt',
            onSelect: onItemSelect,
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Garlic yogurt' }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('yogurt');
    expect(onItemSelect).toHaveBeenCalledExactlyOnceWith('yogurt');
  });

  it('opens a nested menu and selects its command through the root', async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        onSelect={onSelect}
        items={[
          { value: 'new', label: 'New' },
          {
            type: 'submenu',
            value: 'share',
            label: 'Share',
            items: [
              { value: 'messages', label: 'Messages' },
              {
                type: 'submenu',
                value: 'more',
                label: 'More',
                items: [{ value: 'airdrop', label: 'AirDrop' }],
              },
            ],
          },
        ]}
      />,
    );

    const share = screen.getByRole('menuitem', { name: 'Share' });
    expect(share).toHaveAttribute('aria-haspopup', 'menu');
    fireEvent.click(share);

    await waitFor(() =>
      expect(
        screen.getByRole('menuitem', { name: 'Messages' }),
      ).toBeInTheDocument(),
    );
    expect(
      screen
        .getByRole('menuitem', { name: 'Messages' })
        .closest('[role="menu"]'),
    ).toHaveAttribute('data-nested');
    fireEvent.click(screen.getByRole('menuitem', { name: 'More' }));
    await screen.findByRole('menuitem', { name: 'AirDrop' });
    fireEvent.click(screen.getByRole('menuitem', { name: 'AirDrop' }));

    await waitFor(() => expect(onSelect).toHaveBeenCalledOnce());
    expect(onSelect).toHaveBeenCalledWith('airdrop');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('routes keyboard focus into and out of a submenu', async () => {
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[
          {
            type: 'submenu',
            value: 'share',
            label: 'Share',
            items: [{ value: 'messages', label: 'Messages' }],
          },
        ]}
      />,
    );

    const rootMenu = screen.getByRole('menu');
    fireEvent.keyDown(rootMenu, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(rootMenu).toHaveAttribute('aria-activedescendant'),
    );
    fireEvent.keyDown(rootMenu, { key: 'ArrowRight' });

    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2));
    const childMenu = screen.getAllByRole('menu')[1];
    fireEvent.keyDown(childMenu, { key: 'ArrowLeft' });

    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(1));
    await waitFor(() => expect(rootMenu).toHaveFocus());
  });

  it('does not open a disabled submenu', () => {
    render(
      <Menu
        trigger={<button type="button">Open</button>}
        defaultOpen
        items={[
          {
            type: 'submenu',
            value: 'share',
            label: 'Share',
            disabled: true,
            items: [{ value: 'messages', label: 'Messages' }],
          },
        ]}
      />,
    );

    const share = screen.getByRole('menuitem', { name: 'Share' });
    expect(share).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(share);
    expect(
      screen.queryByRole('menuitem', { name: 'Messages' }),
    ).not.toBeInTheDocument();
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
