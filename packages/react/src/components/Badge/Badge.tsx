import { forwardRef } from 'react';
import type { ElementType, ReactElement } from 'react';
import type { MantiBuiltinVariant } from '@manti-ui/tokens';

import { cx } from '../../internal/props';
import type {
  PolymorphicProps,
  PolymorphicRef,
} from '../../internal/polymorphic';

export type BadgeVariant = Exclude<MantiBuiltinVariant, 'tertiary'>;

interface BadgeOwnProps {
  /** Color variant — Badge intentionally omits the tertiary treatment. */
  variant?: BadgeVariant;
  /** Chip size. */
  size?: 'sm' | 'md';
  /** Show a leading status dot. */
  dot?: boolean;
}

export type BadgeProps<TElement extends ElementType = 'span'> =
  PolymorphicProps<TElement, BadgeOwnProps>;

/** A compact status or label chip. */
function BadgeImpl<TElement extends ElementType = 'span'>(
  {
    as,
    variant = 'secondary',
    size = 'sm',
    dot = false,
    className,
    children,
    ...rest
  }: BadgeProps<TElement>,
  ref: PolymorphicRef<TElement>,
) {
  const Root = as ?? 'span';
  return (
    <Root
      {...rest}
      ref={ref}
      data-scope="badge"
      data-part="root"
      data-variant={variant}
      data-size={size}
      className={cx(className)}
    >
      {dot && <span data-scope="badge" data-part="dot" aria-hidden />}
      {children}
    </Root>
  );
}

export const Badge = forwardRef(BadgeImpl as never) as unknown as <
  TElement extends ElementType = 'span',
>(
  props: BadgeProps<TElement> & { ref?: PolymorphicRef<TElement> },
) => ReactElement | null;
