import { useId } from 'react';
import type { ReactNode } from 'react';
import { radioGroup } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface SegmentedControlItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** The segments. */
  items: SegmentedControlItem[];
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Tone used for the focus ring. */
  tone?: MantiTone;
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

/**
 * A single-select control rendered as a row of segments with a pill that slides
 * to the active one. Backed by the Zag.js radio-group machine — it owns keyboard,
 * roving focus, and form semantics, and measures the selected segment to drive
 * the indicator. The radio-group parts are re-scoped to `segmented-control`.
 */
export function SegmentedControl({
  items,
  size = 'md',
  tone = 'primary',
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  name,
  disabled,
  id,
  className,
}: SegmentedControlProps) {
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
    <div
      {...api.getRootProps()}
      data-scope="segmented-control"
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      <span {...api.getIndicatorProps()} data-scope="segmented-control" />
      {items.map((item) => {
        const itemProps = { value: item.value, disabled: item.disabled };
        return (
          <label
            key={item.value}
            {...api.getItemProps(itemProps)}
            data-scope="segmented-control"
          >
            <input
              {...api.getItemHiddenInputProps(itemProps)}
              data-part="hidden-input"
            />
            <span
              {...api.getItemTextProps(itemProps)}
              data-scope="segmented-control"
            >
              {item.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
