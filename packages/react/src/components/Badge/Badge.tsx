import type { HTMLAttributes } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx } from '../../internal/props';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant — drives hue and emphasis (solid → secondary soft → tertiary outline). */
  variant?: MantiVariant;
  /** Chip size. */
  size?: 'sm' | 'md';
  /** Show a leading status dot. */
  dot?: boolean;
}

/** A compact status or label chip. */
export function Badge({
  variant = 'secondary',
  size = 'sm',
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      data-scope="badge"
      data-part="root"
      data-variant={variant}
      data-size={size}
      className={cx(className)}
      {...rest}
    >
      {dot && <span data-scope="badge" data-part="dot" aria-hidden />}
      {children}
    </span>
  );
}
