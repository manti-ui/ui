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

  it('reports selection from composed parts, root first then item', () => {
    const onSelect = vi.fn();
    const onItemSelect = vi.fn();
    render(
      <Menu defaultOpen onSelect={onSelect}>
        <Menu.Trigger>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Group>
            <Menu.GroupLabel>Toppings</Menu.GroupLabel>
            <Menu.Item value="yogurt" onSelect={onItemSelect}>
              Garlic yogurt
            </Menu.Item>
          </Menu.Group>
          <Menu.Separator />
          <Menu.CheckboxItem value="compact" checked>
            Compact
          </Menu.CheckboxItem>
        </Menu.Content>
      </Menu>,
    );

    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Compact' }),
    ).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('menuitem', { name: 'Garlic yogurt' }));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('yogurt');
    expect(onItemSelect).toHaveBeenCalledExactlyOnceWith('yogurt');
  });

  it('lets a command lay out its own slots', () => {
    render(
      <Menu defaultOpen>
        <Menu.Trigger>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item value="edit">
            <Menu.ItemIcon>
              <svg data-testid="pencil" />
            </Menu.ItemIcon>
            <Menu.ItemText>Edit</Menu.ItemText>
            <Menu.ItemShortcut>⌘E</Menu.ItemShortcut>
          </Menu.Item>
        </Menu.Content>
      </Menu>,
    );

    const item = screen.getByRole('menuitem', { name: /Edit/ });
    // Composed slots replace the wrapper, they do not nest inside one.
    expect(item.querySelectorAll('[data-part="item-text"]')).toHaveLength(1);
    expect(item.querySelector('[data-part="item-icon"]')).toContainElement(
      screen.getByTestId('pencil'),
    );
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
