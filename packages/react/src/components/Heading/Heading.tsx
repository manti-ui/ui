import { forwardRef } from 'react';
import type { ElementType, ReactElement } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';
import { parseTypeSize } from '../../internal/typeSize';
import type {
  PolymorphicProps,
  PolymorphicRef,
} from '../../internal/polymorphic';
import type {
  TextAlign,
  TextEmphasis,
  TextScale,
  TextSize,
} from '../Text/Text';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The visual stop each rank falls back to. Only a default — `size` overrides it,
 * so the document outline and the layout never have to agree.
 */
const LEVEL_SIZE: Record<HeadingLevel, TextScale> = {
  1: '4xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'base',
  6: 'sm',
};

interface HeadingOwnProps {
  /** Semantic heading rank; picks the `h1`–`h6` element and the default size. */
  level?: HeadingLevel;
  /**
   * Type-scale stop, optionally with a weight: `'4xl'` or `'4xl/regular'`.
   * Defaults to the stop implied by `level`; leaving the weight off keeps the
   * stylesheet's default, which is bold at `level={1}` and semibold elsewhere.
   */
  size?: TextSize;
  /** Neutral emphasis ladder: title, secondary, or meta. */
  emphasis?: TextEmphasis;
  /** Semantic color. Wins over `emphasis` when both are set. */
  variant?: MantiVariant;
  /** Text alignment. */
  align?: TextAlign;
  /** Clamp to a single line with an ellipsis. */
  truncate?: boolean;
}

export type HeadingProps<TElement extends ElementType = 'h2'> =
  PolymorphicProps<TElement, HeadingOwnProps>;

/** A token-backed heading whose semantic rank and visual size stay independent. */
function HeadingImpl<TElement extends ElementType = 'h2'>(
  {
    as,
    level = 2,
    size,
    emphasis = 'default',
    variant,
    align,
    truncate = false,
    className,
    ...rest
  }: HeadingProps<TElement>,
  ref: PolymorphicRef<TElement>,
) {
  const Root = as ?? (`h${level}` as ElementType);
  const [scale, weight] = parseTypeSize(size ?? LEVEL_SIZE[level]);
  return (
    <Root
      {...rest}
      ref={ref}
      data-scope="heading"
      data-part="root"
      data-level={String(level)}
      data-size={scale}
      data-weight={weight}
      data-emphasis={emphasis === 'default' ? undefined : emphasis}
      data-variant={variant}
      data-align={align}
      data-truncate={dataBool(truncate)}
      className={cx(className)}
    />
  );
}

export const Heading = forwardRef(HeadingImpl as never) as unknown as <
  TElement extends ElementType = 'h2',
>(
  props: HeadingProps<TElement> & { ref?: PolymorphicRef<TElement> },
) => ReactElement | null;
