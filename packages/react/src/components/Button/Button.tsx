import { forwardRef } from 'react';
import type { ElementType, MouseEvent, ReactElement, ReactNode } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';
import type {
  PolymorphicProps,
  PolymorphicRef,
} from '../../internal/polymorphic';
import { Spinner } from '../Spinner/Spinner';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps {
  /**
   * Color variant — drives hue and emphasis (primary solid → secondary soft →
   * tertiary ghost, plus danger and outline). The Button-only `link` value
   * renders as an inline text link.
   */
  variant?: MantiVariant | 'link';
  /** Control size. */
  size?: ButtonSize;
  /** Show a spinner and block interaction while preserving layout width. */
  loading?: boolean;
  /** Stretch to fill the available inline space. */
  fullWidth?: boolean;
  /** Render as a square, icon-only button. Provide an `aria-label`. */
  iconOnly?: boolean;
  /** Content placed before the label. */
  leadingIcon?: ReactNode;
  /** Content placed after the label. */
  trailingIcon?: ReactNode;
  /** Disable activation. Non-button roots receive `aria-disabled`. */
  disabled?: boolean;
}

export type ButtonProps<TElement extends ElementType = 'button'> =
  PolymorphicProps<TElement, ButtonOwnProps>;

/**
 * The workhorse action. Seven color variants forming an emphasis ladder
 * (primary solid → secondary soft → tertiary ghost), three sizes, a smooth
 * press, and a loading state that keeps the button from collapsing.
 */
function ButtonImpl<TElement extends ElementType = 'button'>(
  {
    as,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth,
    iconOnly,
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    children,
    ...rest
  }: ButtonProps<TElement>,
  ref: PolymorphicRef<TElement>,
) {
  const Root = (as ?? 'button') as ElementType;
  const blocked = disabled || loading;
  const rootProps = rest as Record<string, unknown> & {
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    tabIndex?: number;
    type?: 'button' | 'submit' | 'reset';
  };
  const onClick = rootProps.onClick;
  const isButton = Root === 'button';

  return (
    <Root
      {...rootProps}
      ref={ref}
      {...(isButton
        ? {
            type: rootProps.type ?? 'button',
            disabled: blocked,
          }
        : {
            'aria-disabled': blocked || undefined,
            tabIndex: blocked ? (rootProps.tabIndex ?? -1) : rootProps.tabIndex,
            onClick: blocked
              ? (event: MouseEvent<HTMLElement>) => {
                  event.preventDefault();
                  event.stopPropagation();
                }
              : onClick,
          })}
      data-variant={variant}
      data-size={size}
      data-loading={dataBool(loading)}
      data-full-width={dataBool(fullWidth)}
      data-icon-only={dataBool(iconOnly)}
      aria-busy={loading || undefined}
      className={cx(className)}
      // Identity attributes are re-asserted after `rest` so a cloned trigger
      // (e.g. a Dialog/Popover trigger merging in `data-scope='dialog'`) can't
      // clobber the button's own scope and drop its styling.
      data-scope="button"
      data-part="root"
    >
      {loading && (
        <span data-scope="button" data-part="spinner">
          <Spinner size={size === 'lg' ? 'md' : 'sm'} aria-hidden />
        </span>
      )}
      <span data-scope="button" data-part="label">
        {leadingIcon != null && (
          <span data-scope="button" data-part="leading-icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children}
        {trailingIcon != null && (
          <span
            data-scope="button"
            data-part="trailing-icon"
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        )}
      </span>
    </Root>
  );
}

export const Button = forwardRef(ButtonImpl as never) as unknown as <
  TElement extends ElementType = 'button',
>(
  props: ButtonProps<TElement> & { ref?: PolymorphicRef<TElement> },
) => ReactElement | null;
