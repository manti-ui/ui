import { forwardRef, useId, useState } from 'react';
import type {
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';
import { useFocusVisible } from '../../internal/focusVisible';
import { cx, dataBool } from '../../internal/props';
import { CapsLockIcon, EyeIcon, EyeOffIcon } from '../../internal/icons';

export type InputVariant = 'default' | 'fill';

/**
 * How a left/right slot spends the control's inline padding. Plain text (a
 * currency symbol, a unit) reads as part of the value, so it keeps the shell's
 * padding. Anything else is an element that paints its own box — the shell
 * hands that side's padding over to the addon, which insets it far less. See
 * `field.css`.
 */
const slotKind = (content: ReactNode): 'text' | 'node' =>
  typeof content === 'string' || typeof content === 'number' ? 'text' : 'node';

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
  /** Visual treatment. */
  variant?: InputVariant;
  /** Stretch to fill the available inline space. */
  fullWidth?: boolean;
  /** Content rendered inside the control, to the left of the input. */
  left?: ReactNode;
  /** Content rendered inside the control, to the right of the input. */
  right?: ReactNode;
  /** @deprecated Use `left` instead. */
  leadingAddon?: ReactNode;
  /** @deprecated Use `right` instead. */
  trailingAddon?: ReactNode;
  /** Visual required marker. Pass `null` to keep native semantics without a marker. */
  requiredIndicator?: ReactNode | null;
  /** Which surface owns the visible focus treatment. */
  focusRing?: 'control' | 'none';

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
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    size = 'md',
    variant = 'default',
    fullWidth,
    left,
    right,
    leadingAddon,
    trailingAddon,
    requiredIndicator = '*',
    focusRing = 'control',
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
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const invalid = error != null;
  const leftContent = left !== undefined ? left : leadingAddon;
  const rightContent = right !== undefined ? right : trailingAddon;
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
  const focusVisibleProps = useFocusVisible<HTMLDivElement>();

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
      data-variant="primary"
      data-appearance={variant}
      data-invalid={dataBool(invalid)}
      data-full-width={dataBool(fullWidth)}
      data-focus-ring={focusRing}
      className={cx(className)}
    >
      {label != null && (
        <label data-scope="field" data-part="label" htmlFor={inputId}>
          {label}
          {required && requiredIndicator != null && (
            <span data-scope="field" data-part="required" aria-hidden>
              {requiredIndicator}
            </span>
          )}
        </label>
      )}
      <div
        data-scope="field"
        data-part="control"
        data-size={size}
        {...focusVisibleProps}
      >
        {leftContent != null && (
          <span
            data-scope="field"
            data-part="addon"
            data-position="left"
            data-slot={slotKind(leftContent)}
          >
            {leftContent}
          </span>
        )}
        <input
          ref={ref}
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
        {rightContent != null && (
          <span
            data-scope="field"
            data-part="addon"
            data-position="right"
            data-slot={slotKind(rightContent)}
          >
            {rightContent}
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
});
