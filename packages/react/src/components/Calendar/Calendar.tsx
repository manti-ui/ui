import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { datePicker } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

/**
 * A single day-cell value from the underlying date-picker machine. Exposed so
 * `renderDay` consumers can read the date (`.day`, `.month`, `.year`, …).
 */
export type CalendarDayValue = datePicker.DateValue;

export interface CalendarProps {
  /** Tone used for the "today" chip and the selection highlight. */
  tone?: MantiTone;
  /** single, multiple, or range selection. */
  selectionMode?: 'single' | 'multiple' | 'range';
  /** Controlled value as ISO date strings (YYYY-MM-DD). */
  value?: string[];
  /** Initial value for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the value changes; emits ISO date strings. */
  onValueChange?: (value: string[]) => void;
  /** BCP-47 locale for weekday labels, week start, and number formatting. */
  locale?: string;
  /** Day the week starts on: 0 (Sunday) – 6 (Saturday). Defaults to the locale's. */
  startOfWeek?: number;
  /**
   * Always render six week rows so the grid height stays constant across months.
   * Defaults to `false` (each month shows only the weeks it spans).
   */
  fixedWeeks?: boolean;
  /** Earliest selectable date (ISO YYYY-MM-DD); earlier days render disabled. */
  min?: string;
  /** Latest selectable date (ISO YYYY-MM-DD); later days render disabled. */
  max?: string;
  /** Disable the whole calendar. */
  disabled?: boolean;
  /** Render the month but block selection (display-only). */
  readOnly?: boolean;
  /** Form field name for the hidden input. */
  name?: string;
  /**
   * Render custom content inside each day cell (e.g. events), shown below the
   * day number. Receives the day value.
   */
  renderDay?: (day: CalendarDayValue) => ReactNode;
  /** Content rendered at the trailing edge of the toolbar (e.g. a view switcher). */
  actions?: ReactNode;
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

/**
 * A standalone month-grid calendar: a weekday header plus a six-row day grid
 * that shows an entire month at once. Backed by the Zag.js date-picker machine
 * in `inline` mode, so date math, locale/week-start, month navigation, keyboard
 * navigation, and grid a11y come from the machine — this renders the anatomy.
 *
 * Because the machine owns the grid, its functional parts keep
 * `data-scope="date-picker"` (Zag queries the DOM by those attributes); Calendar
 * wraps them in a `data-scope="calendar"` root and styles them under that scope.
 */
export function Calendar({
  tone = 'primary',
  selectionMode = 'single',
  value,
  defaultValue,
  onValueChange,
  locale,
  startOfWeek,
  fixedWeeks = false,
  min,
  max,
  disabled,
  readOnly,
  name,
  renderDay,
  actions,
  id,
  className,
}: CalendarProps) {
  const autoId = useId();
  const parsedValue = useMemo(
    () => (value ? datePicker.parse(value) : undefined),
    [value],
  );
  const parsedDefault = useMemo(
    () => (defaultValue ? datePicker.parse(defaultValue) : undefined),
    [defaultValue],
  );
  const parsedMin = useMemo(() => (min ? datePicker.parse(min) : undefined), [min]);
  const parsedMax = useMemo(() => (max ? datePicker.parse(max) : undefined), [max]);

  const service = useMachine(datePicker.machine, {
    id: id ?? autoId,
    inline: true,
    selectionMode,
    value: parsedValue,
    defaultValue: parsedDefault,
    locale,
    startOfWeek,
    fixedWeeks,
    min: parsedMin,
    max: parsedMax,
    disabled,
    readOnly,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.valueAsString)
      : undefined,
  });
  const api = datePicker.connect(service, normalizeProps);

  return (
    <div
      data-scope="calendar"
      data-part="root"
      data-tone={tone}
      className={cx(className)}
    >
      <div {...api.getContentProps()}>
        <div data-scope="calendar" data-part="toolbar">
          <button
            data-scope="calendar"
            data-part="today-trigger"
            type="button"
            onClick={() => api.setFocusedValue(datePicker.parse(new Date()))}
          >
            Today
          </button>
          <button
            {...api.getPrevTriggerProps({ view: 'day' })}
            aria-label="Previous month"
          >
            {navIcon('M10 3 5 8l5 5')}
          </button>
          <button
            {...api.getNextTriggerProps({ view: 'day' })}
            aria-label="Next month"
          >
            {navIcon('M6 3l5 5-5 5')}
          </button>
          <span data-scope="calendar" data-part="heading" aria-live="polite">
            {api.visibleRangeText.start}
          </span>
          {actions != null && (
            <span data-scope="calendar" data-part="actions">
              {actions}
            </span>
          )}
        </div>
        <div data-scope="calendar" data-part="grid">
          <table
            {...api.getTableProps({ view: 'day', columns: api.weekDays.length })}
          >
            <thead {...api.getTableHeaderProps()}>
              <tr {...api.getTableRowProps()}>
                {api.weekDays.map((day) => (
                  <th
                    key={day.long}
                    {...api.getTableHeadProps()}
                    scope="col"
                    aria-label={day.long}
                  >
                    {day.short}
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
                        <span data-scope="calendar" data-part="day-label">
                          {cellValue.day}
                        </span>
                        {renderDay && (
                          <span data-scope="calendar" data-part="day-content">
                            {renderDay(cellValue)}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
