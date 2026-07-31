import type { HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../internal/props';

/** Semantic color variants supported by Alert. */
export type AlertVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'danger';

export interface AlertProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** Semantic color variant — sets the hue of the soft message panel. */
  variant?: AlertVariant;
  /** Bold leading line. */
  title?: ReactNode;
  /** Leading status icon. */
  icon?: ReactNode;
  /** When provided, renders a dismiss button that calls this handler. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
  /** Product actions rendered below the description. */
  actions?: ReactNode;
  /** Alias for `actions` for message layouts that read as a footer. */
  footer?: ReactNode;
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
  actions,
  footer,
  role,
  className,
  children,
  ...rest
}: AlertProps) {
  const resolvedRole = role ?? (variant === 'danger' ? 'alert' : 'status');

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
        {(footer ?? actions) != null && (
          <div data-scope="alert" data-part="actions">
            {footer ?? actions}
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
