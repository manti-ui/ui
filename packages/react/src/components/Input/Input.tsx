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

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
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
  /** Content rendered inside the control, after the input. */
  trailingAddon?: ReactNode;

  /* Password affordances. Like the inherited `min`/`max` (number) or `accept`
     (file), these apply to one type only — they are inert unless
     `type="password"`. */

  /** Render the show/hide toggle button. @default true */
  showPasswordToggle?: boolean;
  /** Controlled visibility of the password text. */
  passwordVisible?: boolean;
  /** Initial visibility for uncontrolled usage. @default false */
  defaultPasswordVisible?: boolean;
  /** Called whenever the password visibility is toggled. */
  onPasswordVisibilityChange?: (visible: boolean) => void;
  /** Warn the user while Caps Lock is on. @default true */
  showCapsLockWarning?: boolean;
  /**
   * Caps Lock wording. The warning reads as an icon on screen, so this is only
   * ever surfaced to assistive tech. @default 'Caps Lock is on'
   */
  capsLockLabel?: ReactNode;
  /** Accessible label for the toggle while the password is hidden. @default 'Show password' */
  showPasswordLabel?: string;
  /** Accessible label for the toggle while the password is shown. @default 'Hide password' */
  hidePasswordLabel?: string;
}

/**
 * A text input with label, hint, error, and optional adornments. Wires up label
 * association and `aria-describedby`/`aria-invalid` automatically.
 *
 * `type="password"` additionally renders a show/hide toggle and a live Caps Lock
 * warning. Manti UI has no Zag machine for either — they are layered onto the
 * shared `field` shell, so sizing, the focus ring, and the invalid state behave
 * identically across every type.
 */
export function Input({
  label,
  hint,
  error,
  size = 'md',
  tone = 'primary',
  fullWidth,
  leadingAddon,
  trailingAddon,
  showPasswordToggle = true,
  passwordVisible,
  defaultPasswordVisible,
  onPasswordVisibilityChange,
  showCapsLockWarning = true,
  capsLockLabel = 'Caps Lock is on',
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  type = 'text',
  id,
  required,
  disabled,
  className,
  onKeyDown,
  onKeyUp,
  onBlur,
  'aria-describedby': ariaDescribedby,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const invalid = error != null;
  const hintId = hint != null ? `${inputId}-hint` : undefined;
  const errorId = invalid ? `${inputId}-error` : undefined;

  const isPassword = type === 'password';

  const controlled = passwordVisible !== undefined;
  const [internalVisible, setInternalVisible] = useState(
    defaultPasswordVisible ?? false,
  );
  const revealed =
    isPassword && (controlled ? passwordVisible : internalVisible);

  const [capsLock, setCapsLock] = useState(false);
  const showCaps = isPassword && showCapsLockWarning && capsLock;
  const capsId = showCaps ? `${inputId}-caps` : undefined;

  const describedBy =
    [errorId, hintId, capsId, ariaDescribedby].filter(Boolean).join(' ') ||
    undefined;

  const toggleVisibility = () => {
    const next = !revealed;
    if (!controlled) setInternalVisible(next);
    onPasswordVisibilityChange?.(next);
  };

  // Caps Lock state is only readable from a keyboard event, so it is sampled off
  // the key handlers rather than tracked globally, and cleared when focus leaves.
  const syncCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    if (typeof event.getModifierState === 'function') {
      setCapsLock(event.getModifierState('CapsLock'));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isPassword) syncCapsLock(event);
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isPassword) syncCapsLock(event);
    onKeyUp?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (isPassword) setCapsLock(false);
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
          type={revealed ? 'text' : type}
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
            data-scope="field"
            data-part="caps-lock"
            id={capsId}
            role="status"
          >
            <CapsLockIcon />
            {/* The icon carries the message visually; the text stays in the DOM
                unstyled-hidden so the live region has something to announce and
                `aria-describedby` has a description to resolve. */}
            <span data-scope="field" data-part="caps-lock-label">
              {capsLockLabel}
            </span>
          </span>
        )}
        {trailingAddon != null && (
          <span data-scope="field" data-part="addon">
            {trailingAddon}
          </span>
        )}
        {isPassword && showPasswordToggle && (
          <button
            data-scope="field"
            data-part="visibility-trigger"
            type="button"
            disabled={disabled}
            aria-label={revealed ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={revealed}
            aria-controls={inputId}
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggleVisibility}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
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
