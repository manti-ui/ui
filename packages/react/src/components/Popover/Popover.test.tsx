import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from './Popover.js';

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
});
