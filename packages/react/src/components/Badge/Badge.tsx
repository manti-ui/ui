import type { HTMLAttributes } from 'react';
import type { MantiBuiltinVariant } from '@manti-ui/tokens';

import { cx } from '../../internal/props';

export type BadgeVariant = Exclude<MantiBuiltinVariant, 'tertiary'>;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant — Badge intentionally omits the tertiary treatment. */
  variant?: BadgeVariant;
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
