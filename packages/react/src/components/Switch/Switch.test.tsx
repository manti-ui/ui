import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
  it('uses switch semantics and forwards input accessibility props', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Switch
        ref={ref}
        inputProps={{
          'aria-label': 'Notifications',
          'data-testid': 'switch-input',
        }}
        rootProps={{ 'data-testid': 'switch-root' }}
      />,
    );

    const control = screen.getByRole('switch', { name: 'Notifications' });
    expect(control).toBe(ref.current);
    expect(control).toHaveAttribute('data-testid', 'switch-input');
    expect(screen.getByTestId('switch-root')).toContainElement(control);
  });
});
