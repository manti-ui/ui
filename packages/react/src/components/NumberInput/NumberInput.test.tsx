import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('forwards root/input props and the real input ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <NumberInput
        ref={ref}
        label="Servings"
        rootProps={{ 'data-testid': 'number-root' }}
        inputProps={{ 'aria-label': 'Serving count', 'data-knob': 'servings' }}
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Serving count' });
    expect(input).toBe(ref.current);
    expect(input).toHaveAttribute('data-knob', 'servings');
    expect(screen.getByTestId('number-root')).toContainElement(input);
  });
});
