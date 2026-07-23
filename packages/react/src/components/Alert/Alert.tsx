import type { HTMLAttributes, ReactNode } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx } from '../../internal/props';

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** Color variant — sets the hue of the soft message panel. */
  variant?: MantiVariant;
  /** Bold leading line. */
  title?: ReactNode;
  /** Leading status icon. */
  icon?: ReactNode;
  /** When provided, renders a dismiss button that calls this handler. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
}

/**
 * An inline message with an icon, title, description, and an optional dismiss
 * action. Defaults to `role="status"`, escalating to `role="alert"` for the
 * danger variant.
 */
export function Alert({
  variant = 'secondary',
  title,
  icon,
  onDismiss,
  dismissLabel = 'Dismiss',
  role,
  className,
  children,
  ...rest
}: AlertProps) {
  const resolvedRole =
    role ?? (variant === 'danger' ? 'alert' : 'status');

  return (
    <div
      data-scope="alert"
      data-part="root"
      data-variant={variant}
      role={resolvedRole}
      className={cx(className)}
      {...rest}
    >
      {icon != null && (
        <span data-scope="alert" data-part="icon" aria-hidden>
          {icon}
        </span>
      )}
      <div data-scope="alert" data-part="content">
        {title != null && (
          <div data-scope="alert" data-part="title">
            {title}
          </div>
        )}
        {children != null && (
          <div data-scope="alert" data-part="description">
            {children}
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          data-scope="alert"
          data-part="dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
