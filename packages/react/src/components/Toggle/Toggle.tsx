import { toggle } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';
import type { ReactNode } from 'react';
import type { MantiVariant } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';

export interface ToggleProps {
  /** Active variant when pressed. */
  variant?: MantiVariant;
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Initial pressed state for uncontrolled usage. */
  defaultPressed?: boolean;
  /** Called whenever the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void;
  /** Disable the control. */
  disabled?: boolean;
  /** Render as a square, icon-only toggle. Provide an `aria-label`. */
  iconOnly?: boolean;
  className?: string;
  'aria-label'?: string;
  /** Content, or a render function receiving the current pressed state. */
  children?: ReactNode | ((pressed: boolean) => ReactNode);
}

/**
 * A pressable two-state button backed by the shared `@manti-ui/folds` Zag.js
 * toggle machine. The machine owns keyboard, focus, and state behavior; this
 * adapter only renders. Off reads as a quiet outline; on fills with the variant.
 */
export function Toggle({
  variant = 'primary',
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  iconOnly,
  className,
  children,
  ...rest
}: ToggleProps) {
  const service = useMachine(toggle.machine, {
    pressed,
    defaultPressed,
    onPressedChange,
    disabled,
  });
  const api = toggle.connect(service, normalizeProps);

  const content =
    typeof children === 'function' ? children(api.pressed) : children;

  return (
    <button
      {...api.getRootProps()}
      data-variant={variant}
      data-icon-only={dataBool(iconOnly)}
      className={cx(className)}
      {...rest}
    >
      {content}
    </button>
  );
}
