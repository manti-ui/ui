import type { ComponentPropsWithoutRef } from 'react';

import { cx } from '../../internal/props.js';

export interface SpinnerProps extends ComponentPropsWithoutRef<'span'> {
  /** Visual size of the spinner. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label announced to assistive technology. */
  label?: string;
}

/**
 * A calm, continuous loading indicator. Inherits `currentColor`, so it adapts to
 * any context. Pass `aria-hidden` when it is purely decorative (e.g. inside a
 * button that already communicates its busy state).
 */
export function Spinner({
  size = 'md',
  label = 'Loading',
  className,
  ...rest
}: SpinnerProps) {
  return (
    <span
      data-scope="spinner"
      data-part="root"
      data-size={size}
      role="status"
      aria-label={label}
      className={cx(className)}
      {...rest}
    />
  );
}
