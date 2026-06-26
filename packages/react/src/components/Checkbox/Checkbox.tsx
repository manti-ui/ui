import { useId } from 'react';
import type { ReactNode } from 'react';
import { checkbox } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface CheckboxProps {
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Active tone when checked. */
  tone?: MantiTone;
  /** Render the mixed/indeterminate state (uncontrolled). */
  indeterminate?: boolean;
  /** Optional trailing label. */
  children?: ReactNode;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Called whenever the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
  value?: string;
  /** Accessible name for the control when there is no visible label. */
  'aria-label'?: string;
  id?: string;
  className?: string;
}

/**
 * A soft, square control with a smoothly drawn check, backed by the Zag.js
 * checkbox machine. Supports checked and indeterminate states.
 */
export function Checkbox({
  size = 'md',
  tone = 'primary',
  indeterminate = false,
  children,
  className,
  id,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  invalid,
  required,
  readOnly,
  name,
  value,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const autoId = useId();
  const service = useMachine(checkbox.machine, {
    id: id ?? autoId,
    checked: indeterminate ? 'indeterminate' : checked,
    defaultChecked,
    disabled,
    invalid,
    required,
    readOnly,
    name,
    value,
    onCheckedChange: onCheckedChange
      ? (details) => onCheckedChange(details.checked === true)
      : undefined,
  });
  const api = checkbox.connect(service, normalizeProps);

  return (
    <label
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      <input
        {...api.getHiddenInputProps()}
        data-part="hidden-input"
        aria-label={ariaLabel}
      />
      <span {...api.getControlProps()}>
        <span {...api.getIndicatorProps()}>
          <svg viewBox="0 0 24 24" aria-hidden>
            {api.indeterminate ? (
              <path d="M5 12h14" />
            ) : (
              <path d="M5 12.5l4.5 4.5L19 6.5" />
            )}
          </svg>
        </span>
      </span>
      {children != null && <span {...api.getLabelProps()}>{children}</span>}
    </label>
  );
}
