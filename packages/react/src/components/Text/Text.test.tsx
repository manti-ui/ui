import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Text } from './Text';

describe('Text', () => {
  it('maps compound type size and line clamp to data and custom properties', () => {
    render(
      <Text size="lg/semibold" emphasis="muted" lineClamp={2}>
        Supporting copy
      </Text>,
    );

    const text = screen.getByText('Supporting copy');
    expect(text).toHaveAttribute('data-size', 'lg');
    expect(text).toHaveAttribute('data-weight', 'semibold');
    expect(text).toHaveAttribute('data-emphasis', 'muted');
    expect(text).toHaveAttribute('data-line-clamp', '2');
    expect(text.style.getPropertyValue('--_line-clamp')).toBe('2');
  });
});
