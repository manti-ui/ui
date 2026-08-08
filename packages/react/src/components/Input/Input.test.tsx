import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('forwards its ref to the real input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} label="Email" />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });

  it('can hide only the visual required indicator', () => {
    render(<Input label="Email" required requiredIndicator={null} />);

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
    expect(screen.getByText('Email')).toHaveTextContent('Email');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders text and React nodes in the left and right slots', () => {
    render(
      <Input
        aria-label="Amount"
        left="TRY"
        right={<button type="button">Clear</button>}
      />,
    );

    expect(screen.getByText('TRY')).toHaveAttribute('data-position', 'left');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByText('Clear').parentElement).toHaveAttribute(
      'data-position',
      'right',
    );
  });

  it('marks text slots and element slots apart so each gets its own inset', () => {
    render(
      <Input
        aria-label="Amount"
        left="TRY"
        right={<button type="button">Clear</button>}
      />,
    );

    expect(screen.getByText('TRY')).toHaveAttribute('data-slot', 'text');
    expect(screen.getByText('Clear').parentElement).toHaveAttribute(
      'data-slot',
      'node',
    );
  });

  it('prefers left and right over the deprecated addon aliases', () => {
    render(
      <Input
        aria-label="Amount"
        left="New left"
        right="New right"
        leadingAddon="Old left"
        trailingAddon="Old right"
      />,
    );

    expect(screen.getByText('New left')).toBeInTheDocument();
    expect(screen.getByText('New right')).toBeInTheDocument();
    expect(screen.queryByText('Old left')).not.toBeInTheDocument();
    expect(screen.queryByText('Old right')).not.toBeInTheDocument();
  });
});
