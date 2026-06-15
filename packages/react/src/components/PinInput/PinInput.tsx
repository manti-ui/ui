import { useId } from 'react';
import type { ReactNode } from 'react';
import { pinInput } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface PinInputProps {
  /** Number of input cells. */
  length?: number;
  /** Optional field label. */
  label?: ReactNode;
  /** Cell size. */
  size?: 'sm' | 'md' | 'lg';
  /** Focus-ring tone. */
  tone?: MantiTone;
  /** Allowed character type. */
  type?: 'alphanumeric' | 'numeric' | 'alphabetic';
  /** Mask entered characters like a password field. */
  mask?: boolean;
  /** Hint the field is a one-time code (sets autocomplete). */
  otp?: boolean;
  /** Controlled value. */
  value?: string[];
  /** Initial value for uncontrolled usage. */
  defaultValue?: string[];
  /** Called on every change. */
  onValueChange?: (value: string[]) => void;
  /** Called once every cell is filled. */
  onValueComplete?: (value: string[], valueAsString: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A segmented code entry backed by the Zag.js pin-input machine. */
export function PinInput({
  length = 4,
  label,
  size = 'md',
  tone = 'primary',
  type,
  mask,
  otp,
  value,
  defaultValue,
  onValueChange,
  onValueComplete,
  placeholder,
  disabled,
  readOnly,
  invalid,
  required,
  name,
  id,
  className,
}: PinInputProps) {
  const autoId = useId();
  const service = useMachine(pinInput.machine, {
    id: id ?? autoId,
    count: length,
    type,
    mask,
    otp,
    value,
    defaultValue,
    placeholder,
    disabled,
    readOnly,
    invalid,
    required,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
    onValueComplete: onValueComplete
      ? (details) => onValueComplete(details.value, details.valueAsString)
      : undefined,
  });
  const api = pinInput.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        {api.items.map((index) => (
          <input key={index} {...api.getInputProps({ index })} />
        ))}
      </div>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}
