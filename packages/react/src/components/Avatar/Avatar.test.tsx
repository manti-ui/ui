import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('treats an empty source as missing and renders only the fallback', () => {
    render(
      <Avatar src="   " alt="Tutku">
        TK
      </Avatar>,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('TK')).toBeInTheDocument();
  });
});
