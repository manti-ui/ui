import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { MantiTone } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';
import { Spinner } from '../Spinner/Spinner';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. */
  variant?: ButtonVariant;
  /** Semantic tone. */
  tone?: MantiTone;
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
 * The workhorse action. Four variants across every tone, three sizes, a smooth
 * press, and a loading state that keeps the button from collapsing.
 */
export function Button({
  variant = 'solid',
  tone = 'neutral',
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
      data-tone={tone}
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
