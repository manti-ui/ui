import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('forwards a button ref and exposes icon anatomy', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} leadingIcon={<svg data-testid="icon" />}>
        Save
      </Button>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'data-part',
      'leading-icon',
    );
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders a type-safe anchor and blocks it while disabled', () => {
    const onClick = vi.fn();
    render(
      <Button as="a" href="/settings" disabled onClick={onClick}>
        Settings
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
