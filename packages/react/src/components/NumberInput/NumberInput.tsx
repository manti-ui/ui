import { forwardRef, useId } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { numberInput } from '@manti-ui/folds';
import type { MantiVariant } from '@manti-ui/tokens';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { WithDataAttributes } from '../../internal/props';

export interface NumberInputProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Focus-ring variant. */
  variant?: MantiVariant;
  /** Controlled value (string, mirroring the input). */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called whenever the value changes. */
  onValueChange?: (value: string, valueAsNumber: number) => void;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Increment/decrement step. */
  step?: number;
  /** Allow the mouse wheel to change the value while focused. */
  allowMouseWheel?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
  rootProps?: WithDataAttributes<
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>
  >;
  inputProps?: WithDataAttributes<
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | 'value'
      | 'defaultValue'
      | 'disabled'
      | 'readOnly'
      | 'required'
      | 'name'
      | 'min'
      | 'max'
      | 'step'
    >
  >;
}

/** A numeric stepper backed by the Zag.js number-input machine. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      label,
      size = 'md',
      variant = 'primary',
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step,
      allowMouseWheel,
      placeholder,
      disabled,
      readOnly,
      invalid,
      required,
      name,
      id,
      className,
      rootProps,
      inputProps,
    },
    ref,
  ) {
    const autoId = useId();
    const service = useMachine(numberInput.machine, {
      id: id ?? autoId,
      value,
      defaultValue,
      min,
      max,
      step,
      allowMouseWheel,
      disabled,
      readOnly,
      invalid,
      required,
      name,
      onValueChange: onValueChange
        ? (details) => onValueChange(details.value, details.valueAsNumber)
        : undefined,
    });
    const api = numberInput.connect(service, normalizeProps);
    const mergedRootProps = mergeProps(rootProps ?? {}, api.getRootProps());
    const mergedInputProps = mergeProps(inputProps ?? {}, api.getInputProps());

    return (
      <div
        {...mergedRootProps}
        data-size={size}
        data-variant={variant}
        className={cx(mergedRootProps.className, className)}
      >
        {label != null && <label {...api.getLabelProps()}>{label}</label>}
        <div {...api.getControlProps()}>
          <button {...api.getDecrementTriggerProps()} aria-label="Decrement">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 7h8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <input {...mergedInputProps} ref={ref} placeholder={placeholder} />
          <button {...api.getIncrementTriggerProps()} aria-label="Increment">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M7 3v8M3 7h8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  },
);
