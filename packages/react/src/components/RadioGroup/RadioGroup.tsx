import { useId } from 'react';
import type { ReactNode } from 'react';
import { radioGroup } from '@manti-ui/folds';
import type { MantiVariant } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface RadioGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The options. */
  items: RadioGroupItem[];
  /** Optional group label. */
  label?: ReactNode;
  /** Active variant when an option is selected. */
  variant?: MantiVariant;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Called whenever the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Form field name. */
  name?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** A set of mutually exclusive options, backed by the Zag.js radio-group machine. */
export function RadioGroup({
  items,
  label,
  variant = 'primary',
  value,
  defaultValue,
  onValueChange,
  orientation,
  name,
  disabled,
  id,
  className,
}: RadioGroupProps) {
  const autoId = useId();
  const service = useMachine(radioGroup.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    orientation,
    name,
    disabled,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value ?? '')
      : undefined,
  });
  const api = radioGroup.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-variant={variant} className={cx(className)}>
      {label != null && <span {...api.getLabelProps()}>{label}</span>}
      {items.map((item) => {
        const itemProps = { value: item.value, disabled: item.disabled };
        return (
          <label key={item.value} {...api.getItemProps(itemProps)}>
            <input
              {...api.getItemHiddenInputProps(itemProps)}
              data-part="hidden-input"
            />
            <span {...api.getItemControlProps(itemProps)} />
            <span {...api.getItemTextProps(itemProps)}>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}
