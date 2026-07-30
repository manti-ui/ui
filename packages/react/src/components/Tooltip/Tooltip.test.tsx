import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('supports controlled state and portal rendering', () => {
    const onOpenChange = vi.fn();
    render(
      <div data-testid="local-tree">
        <Tooltip
          content="Details"
          open
          portalled
          placement="top"
          onOpenChange={onOpenChange}
        >
          <button type="button">Info</button>
        </Tooltip>
      </div>,
    );

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Details');
    expect(screen.getByTestId('local-tree')).not.toContainElement(tooltip);
  });
});
