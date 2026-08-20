import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Splitter } from './Splitter';

describe('Splitter', () => {
  it('renders panels and a resize separator for each boundary', () => {
    render(
      <Splitter
        orientation="vertical"
        panels={[
          { id: 'left', content: 'Navigation' },
          { id: 'right', content: 'Workspace' },
        ]}
      />,
    );

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });
});
