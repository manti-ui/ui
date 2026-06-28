import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import type {
  ChangeEvent,
  CSSProperties,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import type { MantiTone } from '@manti-ui/tokens';

import { cx, dataBool } from '../../internal/props';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  /** Field label. */
  label?: ReactNode;
  /** Helper text shown below the control when there is no error. */
  hint?: ReactNode;
  /** Alias for `hint`, matching common textarea copy terminology. */
  description?: ReactNode;
  /** Error message. Presence sets the invalid state and replaces the hint. */
  error?: ReactNode;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Tone used for the focus ring. */
  tone?: MantiTone;
  /** Stretch to fill the available inline space. */
  fullWidth?: boolean;
  /** Grow the textarea to fit its content. */
  autoResize?: boolean;
  /** Maximum height used with `autoResize` or native scrolling. */
  maxHeight?: CSSProperties['maxHeight'];
  /** Native resize affordance. */
  resize?: 'none' | 'vertical';
}

/**
 * A multiline text input with label, hint/description, error, and optional
 * auto-resizing. It renders the shared `field` shell so sizing, focus rings,
 * invalid state, and helper text match TextField.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hint,
      description,
      error,
      size = 'md',
      tone = 'primary',
      fullWidth,
      autoResize,
      maxHeight,
      resize = 'vertical',
      rows = 3,
      id,
      required,
      disabled,
      className,
      style,
      onChange,
      value,
      defaultValue,
      'aria-describedby': ariaDescribedby,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaId = id ?? autoId;
    const invalid = error != null;
    const helper = description ?? hint;
    const helperId =
      !invalid && helper != null ? `${textareaId}-hint` : undefined;
    const errorId = invalid ? `${textareaId}-error` : undefined;
    const describedBy =
      [errorId, helperId, ariaDescribedby].filter(Boolean).join(' ') ||
      undefined;

    useImperativeHandle(ref, () => textareaRef.current!, []);

    const syncHeight = useCallback(() => {
      const node = textareaRef.current;
      if (!node || !autoResize) return;

      node.style.height = 'auto';
      node.style.overflowY = 'hidden';
      node.style.height = `${node.scrollHeight}px`;

      if (maxHeight != null && node.scrollHeight > node.clientHeight) {
        node.style.overflowY = 'auto';
      }
    }, [autoResize, maxHeight]);

    useLayoutEffect(() => {
      syncHeight();
    }, [syncHeight, value, defaultValue]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      syncHeight();
    };

    const textareaStyle = maxHeight == null ? style : { ...style, maxHeight };

    return (
      <div
        data-scope="field"
        data-part="root"
        data-size={size}
        data-tone={tone}
        data-invalid={dataBool(invalid)}
        data-disabled={dataBool(disabled)}
        data-full-width={dataBool(fullWidth)}
        className={cx(className)}
      >
        {label != null && (
          <label data-scope="field" data-part="label" htmlFor={textareaId}>
            {label}
            {required && (
              <span data-scope="field" data-part="required" aria-hidden>
                *
              </span>
            )}
          </label>
        )}
        <div
          data-scope="field"
          data-part="control"
          data-size={size}
          data-multiline="true"
        >
          <textarea
            data-scope="field"
            data-part="input"
            data-resize={resize}
            data-auto-resize={dataBool(autoResize)}
            {...rest}
            ref={textareaRef}
            id={textareaId}
            rows={rows}
            required={required}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            style={textareaStyle}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
          />
        </div>
        {invalid ? (
          <p data-scope="field" data-part="error" id={errorId}>
            {error}
          </p>
        ) : (
          helper != null && (
            <p data-scope="field" data-part="hint" id={helperId}>
              {helper}
            </p>
          )
        )}
      </div>
    );
  },
);
