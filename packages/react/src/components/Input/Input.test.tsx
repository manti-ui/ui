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
});
