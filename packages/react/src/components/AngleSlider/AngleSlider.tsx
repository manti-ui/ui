import { useId } from 'react';
import type { ReactNode } from 'react';
import { angleSlider } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface AngleSliderProps {
  /** Optional label. */
  label?: ReactNode;
  /** Thumb/marker tone. */
  tone?: MantiTone;
  /** Snap step in degrees. */
  step?: number;
  /** Controlled angle (0–360). */
  value?: number;
  /** Initial angle for uncontrolled usage. */
  defaultValue?: number;
  /** Called whenever the angle changes. */
  onValueChange?: (value: number) => void;
  /** Tick marks at the given degrees. */
  marks?: number[];
  /** Show the current degree value. */
  showValue?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A circular angle picker backed by the Zag.js angle-slider machine. */
export function AngleSlider({
  label,
  tone = 'primary',
  step,
  value,
  defaultValue,
  onValueChange,
  marks,
  showValue,
  disabled,
  readOnly,
  name,
  id,
  className,
}: AngleSliderProps) {
  const autoId = useId();
  const service = useMachine(angleSlider.machine, {
    id: id ?? autoId,
    step,
    value,
    defaultValue,
    disabled,
    readOnly,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = angleSlider.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <div {...api.getThumbProps()} />
        {marks != null && marks.length > 0 && (
          <div {...api.getMarkerGroupProps()}>
            {marks.map((markValue) => (
              <div
                key={markValue}
                {...api.getMarkerProps({ value: markValue })}
              />
            ))}
          </div>
        )}
      </div>
      {showValue && (
        <span {...api.getValueTextProps()}>{api.valueAsDegree}</span>
      )}
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}
