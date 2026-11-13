import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from './Drawer.js';

// jsdom has no layout, so every element reports a zero size and the dialog's
// focus trap treats it as hidden. Give elements a size so the trap can focus.
function giveElementsLayout() {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1);
}

describe('Drawer', () => {
  it('renders the selected placement and closes through its slot action', async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer
        defaultOpen
        placement="left"
        size="lg"
        title="Navigation"
        onOpenChange={onOpenChange}
        children={({ close }) => (
          <button type="button" onClick={close}>
            Done
          </button>
        )}
      />,
    );

    const drawer = screen.getByRole('dialog', { name: 'Navigation' });
    expect(drawer).toHaveAttribute('data-placement', 'left');
    expect(drawer).toHaveAttribute('data-size', 'lg');

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('names the close trigger "Close" by default', () => {
    render(<Drawer defaultOpen title="Filters" />);

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('uses closeLabel as the close trigger name', () => {
    render(<Drawer defaultOpen title="Filters" closeLabel="Close filters" />);

    expect(
      screen.getByRole('button', { name: 'Close filters' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('focuses the element initialFocusEl returns when it opens', async () => {
    giveElementsLayout();
    function Example() {
      const searchRef = useRef<HTMLInputElement>(null);
      return (
        <Drawer
          trigger={<button type="button">Open filters</button>}
          title="Filters"
          initialFocusEl={() => searchRef.current}
        >
          <button type="button">Reset</button>
          <input ref={searchRef} aria-label="Search" />
        </Drawer>
      );
    }
    render(<Example />);

    fireEvent.click(screen.getByRole('button', { name: 'Open filters' }));

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus(),
    );
  });
});
