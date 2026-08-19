import { forwardRef } from 'react';
import type { CSSProperties, ElementType, ReactElement } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';
import { parseTypeSize } from '../../internal/typeSize';
import type {
  PolymorphicProps,
  PolymorphicRef,
} from '../../internal/polymorphic';

/** A stop on the shared type scale. */
export type TextScale =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/**
 * Scale stop, optionally with a weight after a slash: `'lg'` or `'lg/semibold'`.
 * Leaving the weight off keeps whatever the stylesheet decides for that stop.
 */
export type TextSize = TextScale | `${TextScale}/${TextWeight}`;

/** Neutral hierarchy — how loud the text is, independent of its hue. */
export type TextEmphasis = 'default' | 'muted' | 'subtle';

export type TextAlign = 'start' | 'center' | 'end' | 'justify';

interface TextOwnProps {
  /** Type-scale stop, optionally with a weight: `'lg'` or `'lg/semibold'`. */
  size?: TextSize;
  /** Neutral emphasis ladder: body, secondary, or meta. */
  emphasis?: TextEmphasis;
  /** Semantic color. Wins over `emphasis` when both are set. */
  variant?: MantiVariant;
  /** Text alignment. */
  align?: TextAlign;
  /** Clamp to a single line with an ellipsis. Ignored when `lineClamp` is set. */
  truncate?: boolean;
  /** Clamp to this many lines with an ellipsis. */
  lineClamp?: number;
}

export type TextProps<TElement extends ElementType = 'p'> = PolymorphicProps<
  TElement,
  TextOwnProps
>;

/** Token-backed body copy with a neutral emphasis ladder and semantic color. */
function TextImpl<TElement extends ElementType = 'p'>(
  {
    as,
    size = 'base',
    emphasis = 'default',
    variant,
    align,
    truncate = false,
    lineClamp,
    className,
    style,
    ...rest
  }: TextProps<TElement>,
  ref: PolymorphicRef<TElement>,
) {
  const Root = as ?? 'p';
  const [scale, weight] = parseTypeSize(size);
  const clamped = typeof lineClamp === 'number';
  return (
    <Root
      {...rest}
      ref={ref}
      data-scope="text"
      data-part="root"
      data-size={scale}
      data-weight={weight}
      data-emphasis={emphasis === 'default' ? undefined : emphasis}
      data-variant={variant}
      data-align={align}
      data-truncate={clamped ? undefined : dataBool(truncate)}
      data-line-clamp={clamped ? String(lineClamp) : undefined}
      className={cx(className)}
      style={
        clamped
          ? ({ ...style, '--_line-clamp': lineClamp } as CSSProperties)
          : style
      }
    />
  );
}

export const Text = forwardRef(TextImpl as never) as unknown as <
  TElement extends ElementType = 'p',
>(
  props: TextProps<TElement> & { ref?: PolymorphicRef<TElement> },
) => ReactElement | null;
