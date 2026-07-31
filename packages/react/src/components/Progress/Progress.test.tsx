import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './Progress';

describe('Progress', () => {
  it('forwards native and ARIA props to the progressbar root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Progress
        ref={ref}
        value={42}
        rootProps={{
          'aria-label': 'Karma',
          'data-testid': 'karma-progress',
        }}
      />,
    );

    const root = screen.getByRole('progressbar', { name: 'Karma' });
    expect(root).toBe(ref.current);
    expect(root).toHaveAttribute('aria-valuenow', '42');
    expect(root).toHaveAttribute('data-testid', 'karma-progress');
  });
});
