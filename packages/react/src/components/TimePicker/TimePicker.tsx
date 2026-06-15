import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { timePicker } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';

const periods = ['am', 'pm'] as const;

const parseTime = (input?: string) => {
  if (!input) return undefined;
  const [hour, minute] = input.split(':').map((part) => Number(part));
  if (Number.isNaN(hour)) return undefined;
  return timePicker.parse({ hour, minute: Number.isNaN(minute) ? 0 : minute });
};

export interface TimePickerProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Selection-highlight tone. */
  tone?: MantiTone;
  /** Initial value as "HH:mm" (24-hour). */
  defaultValue?: string;
  /** Called whenever the value changes; emits the formatted time string. */
  onValueChange?: (value: string) => void;
  /** Placement of the panel relative to the control. */
  placement?: Placement;
  disabled?: boolean;
  readOnly?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A time picker backed by the Zag.js time-picker machine. */
export function TimePicker({
  label,
  tone = 'primary',
  defaultValue,
  onValueChange,
  placement = 'bottom-start',
  disabled,
  readOnly,
  name,
  id,
  className,
}: TimePickerProps) {
  const autoId = useId();
  const parsedDefault = useMemo(() => parseTime(defaultValue), [defaultValue]);
  // `@zag-js/time-picker` trails the 1.41 line (latest 1.22.1), so its machine
  // types resolve a different `@zag-js/core` than `useMachine`. The runtime
  // contract is identical; bridge the type skew at this boundary only.
  const service = useMachine(
    timePicker.machine as never,
    {
      id: id ?? autoId,
      defaultValue: parsedDefault,
      disabled,
      readOnly,
      name,
      positioning: { placement },
      onValueChange: onValueChange
        ? (details: timePicker.ValueChangeDetails) =>
            onValueChange(details.valueAsString)
        : undefined,
    } as never,
  );
  const api = timePicker.connect(service as never, normalizeProps as never);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} />
        <button {...api.getTriggerProps()} aria-label="Open time picker">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle
              cx="8"
              cy="8"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M8 5v3l2 1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <Portal>
        <div {...api.getPositionerProps()}>
          <div {...api.getContentProps()}>
            <div {...api.getColumnProps({ unit: 'hour' })}>
              {api.getHours().map((cell) => (
                <button
                  key={cell.value}
                  {...api.getHourCellProps({ value: cell.value })}
                >
                  {cell.label}
                </button>
              ))}
            </div>
            <div {...api.getColumnProps({ unit: 'minute' })}>
              {api.getMinutes().map((cell) => (
                <button
                  key={cell.value}
                  {...api.getMinuteCellProps({ value: cell.value })}
                >
                  {cell.label}
                </button>
              ))}
            </div>
            <div {...api.getColumnProps({ unit: 'period' })}>
              {periods.map((period) => (
                <button
                  key={period}
                  {...api.getPeriodCellProps({ value: period })}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}
