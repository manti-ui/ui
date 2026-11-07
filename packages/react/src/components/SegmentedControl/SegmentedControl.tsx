import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { radioGroup } from '@manti-ui/folds';
import type { MantiVariant } from '@manti-ui/tokens';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props.js';
import type { WithDataAttributes } from '../../internal/props.js';

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
  /** Variant used for the focus ring. */
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
  /**
   * ARIA, data, style, class, and native props for the group root. Name the
   * group here with `aria-label` or `aria-labelledby`.
   */
  rootProps?: WithDataAttributes<
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>
  >;
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
  variant = 'primary',
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  name,
  disabled,
  id,
  className,
  rootProps,
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
  // The machine always points `aria-labelledby` at a label part this control
  // never renders. Drop that dangling reference so a consumer `aria-label` is
  // not shadowed, and let a consumer `aria-labelledby` take its place.
  const machineRootProps = { ...api.getRootProps() };
  delete machineRootProps['aria-labelledby'];
  const mergedRootProps = mergeProps(rootProps ?? {}, machineRootProps);

  return (
    <div
      {...mergedRootProps}
      data-scope="segmented-control"
      data-size={size}
      data-variant={variant}
      className={cx(mergedRootProps.className, className)}
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
