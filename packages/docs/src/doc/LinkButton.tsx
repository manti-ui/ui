import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { ButtonSize } from '@manti-ui/react';
import type { MantiVariant } from '@manti-ui/tokens';

export interface LinkButtonProps {
  to: string;
  children: ReactNode;
  variant?: MantiVariant;
  size?: ButtonSize;
  external?: boolean;
}

/**
 * A link that wears the Button skin. Manti's button styles key off the public
 * `data-scope`/`data-part` anatomy, not the element, so an anchor with those
 * attributes is styled identically — valid HTML, full SPA navigation.
 */
export function LinkButton({
  to,
  children,
  variant = 'primary',
  size = 'md',
  external,
}: LinkButtonProps) {
  const anatomy = {
    'data-scope': 'button',
    'data-part': 'root',
    'data-variant': variant,
    'data-size': size,
  } as const;

  const label = (
    <span data-scope="button" data-part="label">
      {children}
    </span>
  );

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" {...anatomy}>
        {label}
      </a>
    );
  }
  return (
    <Link to={to} {...anatomy}>
      {label}
    </Link>
  );
}
