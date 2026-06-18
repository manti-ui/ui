import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { datePicker } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';

export interface DatePickerProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Selection-highlight tone. */
  tone?: MantiTone;
  /** single, multiple, or range selection. */
  selectionMode?: 'single' | 'multiple' | 'range';
  /** Controlled value as ISO date strings (YYYY-MM-DD). */
  value?: string[];
  /** Initial value for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the value changes; emits ISO date strings. */
  onValueChange?: (value: string[]) => void;
  /** BCP-47 locale for formatting. */
  locale?: string;
  /** Placement of the calendar relative to the control. */
  placement?: Placement;
  disabled?: boolean;
  readOnly?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

const navIcon = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A calendar date picker backed by the Zag.js date-picker machine (day view). */
export function DatePicker({
  label,
  tone = 'primary',
  selectionMode = 'single',
  value,
  defaultValue,
  onValueChange,
  locale,
  placement = 'bottom-start',
  disabled,
  readOnly,
  name,
  id,
  className,
}: DatePickerProps) {
  const autoId = useId();
  const parsedValue = useMemo(
    () => (value ? datePicker.parse(value) : undefined),
    [value],
  );
  const parsedDefault = useMemo(
    () => (defaultValue ? datePicker.parse(defaultValue) : undefined),
    [defaultValue],
  );
  const service = useMachine(datePicker.machine, {
    id: id ?? autoId,
    selectionMode,
    value: parsedValue,
    defaultValue: parsedDefault,
    locale,
    disabled,
    readOnly,
    name,
    positioning: { placement },
    onValueChange: onValueChange
      ? (details) => onValueChange(details.valueAsString)
      : undefined,
  });
  const api = datePicker.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} />
        <button {...api.getTriggerProps()} aria-label="Open calendar">
          {navIcon(
            'M4 2v2M12 2v2M2.5 6.5h11M3 4h10a.5.5 0 0 1 .5.5V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4.5A.5.5 0 0 1 3 4z',
          )}
        </button>
      </div>
      <Portal>
        <div {...api.getPositionerProps()} data-tone={tone}>
          <div {...api.getContentProps()}>
            <div {...api.getViewControlProps()}>
              <button
                {...api.getPrevTriggerProps()}
                aria-label="Previous month"
              >
                {navIcon('M10 3 5 8l5 5')}
              </button>
              <button {...api.getViewTriggerProps()}>
                {api.visibleRangeText.start}
              </button>
              <button {...api.getNextTriggerProps()} aria-label="Next month">
                {navIcon('M6 3l5 5-5 5')}
              </button>
            </div>
            <table {...api.getTableProps()}>
              <thead {...api.getTableHeaderProps()}>
                <tr {...api.getTableRowProps()}>
                  {api.weekDays.map((day) => (
                    <th key={day.long} {...api.getTableHeadProps()} scope="col">
                      {day.narrow}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody {...api.getTableBodyProps()}>
                {api.weeks.map((week, weekIndex) => (
                  <tr key={weekIndex} {...api.getTableRowProps()}>
                    {week.map((cellValue, dayIndex) => (
                      <td
                        key={dayIndex}
                        {...api.getDayTableCellProps({ value: cellValue })}
                      >
                        <div
                          {...api.getDayTableCellTriggerProps({
                            value: cellValue,
                          })}
                        >
                          {cellValue.day}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Portal>
    </div>
  );
}
