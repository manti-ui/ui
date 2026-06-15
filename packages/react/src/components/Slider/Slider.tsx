import { useId } from 'react';
import type { ReactNode } from 'react';
import { slider } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

const toArray = (value: number | number[] | undefined): number[] | undefined =>
  value == null ? undefined : Array.isArray(value) ? value : [value];

export interface SliderProps {
  /** Optional label. */
  label?: ReactNode;
  /** Filled-track tone. */
  tone?: MantiTone;
  /** Controlled value. Pass an array for a range slider. */
  value?: number | number[];
  /** Initial value for uncontrolled usage. */
  defaultValue?: number | number[];
  /** Called whenever the value changes. */
  onValueChange?: (value: number[]) => void;
  /** Called when a drag/keyboard interaction settles. */
  onValueChangeEnd?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  /** Tick marks rendered along the track. */
  marks?: number[];
  /** Show the current value next to the label. */
  showValue?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A draggable value selector backed by the Zag.js slider machine. */
export function Slider({
  label,
  tone = 'primary',
  value,
  defaultValue,
  onValueChange,
  onValueChangeEnd,
  min,
  max,
  step,
  orientation,
  marks,
  showValue,
  disabled,
  readOnly,
  invalid,
  name,
  id,
  className,
}: SliderProps) {
  const autoId = useId();
  const service = useMachine(slider.machine, {
    id: id ?? autoId,
    value: toArray(value),
    defaultValue: toArray(defaultValue) ?? [min ?? 0],
    min,
    max,
    step,
    orientation,
    disabled,
    readOnly,
    invalid,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
    onValueChangeEnd: onValueChangeEnd
      ? (details) => onValueChangeEnd(details.value)
      : undefined,
  });
  const api = slider.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {(label != null || showValue) && (
        <div data-part="header">
          {label != null && <label {...api.getLabelProps()}>{label}</label>}
          {showValue && (
            <output {...api.getValueTextProps()}>
              {api.value.join(' – ')}
            </output>
          )}
        </div>
      )}
      <div {...api.getControlProps()}>
        <div {...api.getTrackProps()}>
          <div {...api.getRangeProps()} />
        </div>
        {api.value.map((_, index) => (
          <div key={index} {...api.getThumbProps({ index })}>
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
        {marks != null && marks.length > 0 && (
          <div {...api.getMarkerGroupProps()}>
            {marks.map((markValue) => (
              <span
                key={markValue}
                {...api.getMarkerProps({ value: markValue })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
