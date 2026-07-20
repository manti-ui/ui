import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';
import { Spinner } from '../Spinner/Spinner';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
}

/**
 * The workhorse action. Seven color variants forming an emphasis ladder
 * (primary solid → secondary soft → tertiary ghost), three sizes, a smooth
 * press, and a loading state that keeps the button from collapsing.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth,
  iconOnly,
  leadingIcon,
  trailingIcon,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      data-size={size}
      data-loading={dataBool(loading)}
      data-full-width={dataBool(fullWidth)}
      data-icon-only={dataBool(iconOnly)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(className)}
      {...rest}
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
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
    </button>
  );
}
