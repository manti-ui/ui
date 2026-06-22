import { useId, useState } from 'react';
import type {
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';
import type { MantiTone } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';
import { CapsLockIcon, EyeIcon, EyeOffIcon } from '../../internal/icons';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Field label. */
  label?: ReactNode;
  /** Helper text shown below the control when there is no error. */
  hint?: ReactNode;
  /** Error message. Presence sets the invalid state and replaces the hint. */
  error?: ReactNode;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Tone used for the focus ring. */
  tone?: MantiTone;
  /** Stretch to fill the available inline space. */
  fullWidth?: boolean;
  /** Content rendered inside the control, before the input. */
  leadingAddon?: ReactNode;
  /** Render the show/hide toggle button. @default true */
  showVisibilityToggle?: boolean;
  /** Controlled visibility of the password text. */
  visible?: boolean;
  /** Initial visibility for uncontrolled usage. @default false */
  defaultVisible?: boolean;
  /** Called whenever the visibility is toggled. */
  onVisibilityChange?: (visible: boolean) => void;
  /** Warn the user while Caps Lock is on. @default true */
  showCapsLockWarning?: boolean;
  /** Caps Lock warning copy. @default 'Caps Lock is on' */
  capsLockLabel?: ReactNode;
  /** Accessible label for the toggle when the password is hidden. @default 'Show password' */
  showLabel?: string;
  /** Accessible label for the toggle when the password is shown. @default 'Hide password' */
  hideLabel?: string;
}

/**
 * A password field with a show/hide toggle and a live Caps Lock warning. Manti
 * UI has no Zag machine for this — it renders the shared `field` shell (so label
 * association, `aria-describedby`/`aria-invalid`, sizing, and the focus ring all
 * behave exactly like {@link TextField}) and layers the password affordances on top.
 */
export function PasswordInput({
  label,
  hint,
  error,
  size = 'md',
  tone = 'primary',
  fullWidth,
  leadingAddon,
  showVisibilityToggle = true,
  visible,
  defaultVisible,
  onVisibilityChange,
  showCapsLockWarning = true,
  capsLockLabel = 'Caps Lock is on',
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  id,
  required,
  disabled,
  className,
  onKeyDown,
  onKeyUp,
  onBlur,
  'aria-describedby': ariaDescribedby,
  ...rest
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const invalid = error != null;
  const hintId = hint != null ? `${inputId}-hint` : undefined;
  const errorId = invalid ? `${inputId}-error` : undefined;

  const controlled = visible !== undefined;
  const [internalVisible, setInternalVisible] = useState(
    defaultVisible ?? false,
  );
  const isVisible = controlled ? visible : internalVisible;

  const [capsLock, setCapsLock] = useState(false);
  const showCaps = showCapsLockWarning && capsLock;
  const capsId = showCaps ? `${inputId}-caps` : undefined;

  const describedBy =
    [errorId, hintId, capsId, ariaDescribedby].filter(Boolean).join(' ') ||
    undefined;

  const toggleVisibility = () => {
    const next = !isVisible;
    if (!controlled) setInternalVisible(next);
    onVisibilityChange?.(next);
  };

  const syncCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    if (typeof event.getModifierState === 'function') {
      setCapsLock(event.getModifierState('CapsLock'));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    syncCapsLock(event);
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    syncCapsLock(event);
    onKeyUp?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setCapsLock(false);
    onBlur?.(event);
  };

  return (
    <div
      data-scope="field"
      data-part="root"
      data-size={size}
      data-tone={tone}
      data-invalid={dataBool(invalid)}
      data-full-width={dataBool(fullWidth)}
      className={cx(className)}
    >
      {label != null && (
        <label data-scope="field" data-part="label" htmlFor={inputId}>
          {label}
          {required && (
            <span data-scope="field" data-part="required" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <div data-scope="field" data-part="control" data-size={size}>
        {leadingAddon != null && (
          <span data-scope="field" data-part="addon">
            {leadingAddon}
          </span>
        )}
        <input
          data-scope="field"
          data-part="input"
          {...rest}
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          required={required}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
        {showCaps && (
          <span
            data-scope="password-input"
            data-part="caps-lock"
            id={capsId}
            role="status"
          >
            <CapsLockIcon />
            {capsLockLabel}
          </span>
        )}
        {showVisibilityToggle && (
          <button
            data-scope="password-input"
            data-part="visibility-trigger"
            type="button"
            disabled={disabled}
            aria-label={isVisible ? hideLabel : showLabel}
            aria-pressed={isVisible}
            aria-controls={inputId}
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggleVisibility}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {invalid ? (
        <p data-scope="field" data-part="error" id={errorId}>
          {error}
        </p>
      ) : (
        hint != null && (
          <p data-scope="field" data-part="hint" id={hintId}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}
