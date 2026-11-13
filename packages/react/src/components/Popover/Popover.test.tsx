import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from './Popover.js';
import type { PopoverProps } from './Popover.js';

/** Lets the machine's deferred (next-frame) dismiss and focus setup run. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

/** Opens a trigger-less popover from an outside button, as a key handler would. */
function Shortcut(props: Partial<PopoverProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Outside
      </button>
      <button type="button">Elsewhere</button>
      <Popover title="Jobs" open={open} onOpenChange={setOpen} {...props}>
        <button type="button">Inside</button>
      </Popover>
    </>
  );
}

async function openFromOutside() {
  const outside = screen.getByRole('button', { name: 'Outside' });
  outside.focus();
  fireEvent.click(outside);
  const inside = await screen.findByRole('button', { name: 'Inside' });
  // jsdom has no layout, so the machine's first-tabbable search finds
  // nothing; put focus inside the panel the way a user tabbing in would.
  if (document.activeElement !== inside) inside.focus();
  await settle();
  return { outside, inside };
}

describe('Popover', () => {
  it('renders a controlled panel and closes with its close trigger', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        open
        title="More information"
        showCloseButton
        onOpenChange={onOpenChange}
        trigger={<button type="button">Info</button>}
      >
        Details
      </Popover>,
    );

    expect(
      screen.getByRole('dialog', { name: 'More information' }),
    ).toHaveTextContent('Details');
    const close = screen.getByRole('button', { name: /close/i });
    fireEvent.click(close);

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('writes width and maxWidth to the content tokens', () => {
    render(
      <Popover
        open
        title="Notifications"
        width="24rem"
        maxWidth={480}
        trigger={<button type="button">Inbox</button>}
      >
        Rows
      </Popover>,
    );

    const content = screen.getByRole('dialog', { name: 'Notifications' });
    expect(content.style.getPropertyValue('--manti-popover-width')).toBe(
      '24rem',
    );
    expect(content.style.getPropertyValue('--manti-popover-max-width')).toBe(
      '480px',
    );
  });

  it('lifts the default cap to a length width set without maxWidth', () => {
    const { rerender } = render(
      <Popover
        open
        title="Wide"
        width="24rem"
        trigger={<button type="button">Open</button>}
      >
        Rows
      </Popover>,
    );

    const content = screen.getByRole('dialog', { name: 'Wide' });
    expect(content.style.getPropertyValue('--manti-popover-max-width')).toBe(
      '24rem',
    );

    rerender(
      <Popover
        open
        title="Wide"
        width="fit-content"
        trigger={<button type="button">Open</button>}
      >
        Rows
      </Popover>,
    );
    expect(content.style.getPropertyValue('--manti-popover-max-width')).toBe(
      '',
    );
  });

  it('merges contentProps onto the content part without overriding the machine', () => {
    render(
      <Popover
        open
        title="Filters"
        className="from-prop"
        maxWidth="30rem"
        contentProps={{
          id: 'consumer-id',
          role: 'region',
          className: 'from-content-props',
          style: { inlineSize: '12rem' },
          'aria-roledescription': 'filter panel',
        }}
        trigger={<button type="button">Filter</button>}
      >
        Body
      </Popover>,
    );

    const content = screen.getByRole('dialog', { name: 'Filters' });
    expect(content).not.toHaveAttribute('id', 'consumer-id');
    expect(content).toHaveAttribute('aria-roledescription', 'filter panel');
    expect(content).toHaveClass('from-content-props', 'from-prop');
    expect(content.style.inlineSize).toBe('12rem');
    expect(content.style.getPropertyValue('--manti-popover-max-width')).toBe(
      '30rem',
    );
  });

  it('renders a trigger-less panel opened through `open`', () => {
    const { container } = render(
      <Popover open title="Jobs">
        Rows
      </Popover>,
    );

    expect(screen.getByRole('dialog', { name: 'Jobs' })).toHaveTextContent(
      'Rows',
    );
    expect(
      container.ownerDocument.querySelector('[data-part="trigger"]'),
    ).toBeNull();
  });

  it('hands getAnchorRect to the machine as the positioning anchor', async () => {
    const getAnchorRect = vi.fn(() => ({
      x: 120,
      y: 40,
      width: 80,
      height: 24,
    }));
    render(
      <Popover open title="Anchored" getAnchorRect={getAnchorRect}>
        Rows
      </Popover>,
    );

    // The popper only reads the rect when placing the panel, so a call proves
    // the option reached the machine's `positioning`. (jsdom has no layout,
    // so the resulting coordinates are not observable here.)
    await waitFor(() => expect(getAnchorRect).toHaveBeenCalled());
  });

  it('focuses initialFocusEl on open and finalFocusEl on Escape', async () => {
    render(
      <Shortcut
        initialFocusEl={() => screen.getByRole('button', { name: 'Inside' })}
        finalFocusEl={() => screen.getByRole('button', { name: 'Elsewhere' })}
      />,
    );
    const { inside } = await openFromOutside();
    await waitFor(() => expect(inside).toHaveFocus());

    fireEvent.keyDown(inside, { key: 'Escape' });

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus(),
    );
  });

  it('returns focus to the element focused before a trigger-less popover opened', async () => {
    render(<Shortcut />);
    const { outside } = await openFromOutside();

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });

    await waitFor(() => expect(outside).toHaveFocus());
  });

  it('leaves focus alone on close with restoreFocus={false}', async () => {
    render(<Shortcut restoreFocus={false} />);
    const { outside } = await openFromOutside();

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await settle();
    expect(outside).not.toHaveFocus();
  });

  it('keeps the popover open when a persistent element is clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <button type="button" id="keep">
          Keep
        </button>
        <Popover
          open
          title="Persistent"
          onOpenChange={onOpenChange}
          persistentElements={[() => document.getElementById('keep')]}
        >
          Rows
        </Popover>
      </>,
    );

    await settle();
    const keep = screen.getByRole('button', { name: 'Keep' });
    fireEvent.pointerDown(keep);
    fireEvent.pointerUp(keep);
    fireEvent.click(keep);
    await settle();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it('returns focus to the trigger on Escape', async () => {
    render(
      <Popover title="Tips" trigger={<button type="button">Tips</button>}>
        <button type="button">Inside</button>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Tips' });
    fireEvent.click(trigger);
    const inside = await screen.findByRole('button', { name: 'Inside' });
    inside.focus();
    await settle();
    fireEvent.keyDown(inside, { key: 'Escape' });

    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
