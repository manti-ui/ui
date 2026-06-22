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

/** Number of columns used by the month and year grids. */
const GRID_COLUMNS = 4;

/**
 * A calendar date picker backed by the Zag.js date-picker machine. The header
 * label cycles the view (day → month → year) so a year can be picked directly.
 */
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
            {/* Day view */}
            <div hidden={api.view !== 'day'}>
              <div {...api.getViewControlProps({ view: 'day' })}>
                <button
                  {...api.getPrevTriggerProps({ view: 'day' })}
                  aria-label="Previous month"
                >
                  {navIcon('M10 3 5 8l5 5')}
                </button>
                <button {...api.getViewTriggerProps({ view: 'day' })}>
                  {api.visibleRangeText.start}
                </button>
                <button
                  {...api.getNextTriggerProps({ view: 'day' })}
                  aria-label="Next month"
                >
                  {navIcon('M6 3l5 5-5 5')}
                </button>
              </div>
              <table
                {...api.getTableProps({
                  view: 'day',
                  columns: api.weekDays.length,
                })}
              >
                <thead {...api.getTableHeaderProps()}>
                  <tr {...api.getTableRowProps()}>
                    {api.weekDays.map((day) => (
                      <th
                        key={day.long}
                        {...api.getTableHeadProps()}
                        scope="col"
                      >
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

            {/* Month view */}
            <div hidden={api.view !== 'month'}>
              <div {...api.getViewControlProps({ view: 'month' })}>
                <button
                  {...api.getPrevTriggerProps({ view: 'month' })}
                  aria-label="Previous year"
                >
                  {navIcon('M10 3 5 8l5 5')}
                </button>
                <button {...api.getViewTriggerProps({ view: 'month' })}>
                  {api.visibleRange.start.year}
                </button>
                <button
                  {...api.getNextTriggerProps({ view: 'month' })}
                  aria-label="Next year"
                >
                  {navIcon('M6 3l5 5-5 5')}
                </button>
              </div>
              <table
                {...api.getTableProps({ view: 'month', columns: GRID_COLUMNS })}
              >
                <tbody {...api.getTableBodyProps()}>
                  {api
                    .getMonthsGrid({ columns: GRID_COLUMNS, format: 'short' })
                    .map((months, rowIndex) => (
                      <tr
                        key={rowIndex}
                        {...api.getTableRowProps({ view: 'month' })}
                      >
                        {months.map((month) => (
                          <td
                            key={month.value}
                            {...api.getMonthTableCellProps({
                              ...month,
                              columns: GRID_COLUMNS,
                            })}
                          >
                            <div
                              {...api.getMonthTableCellTriggerProps({
                                ...month,
                                columns: GRID_COLUMNS,
                              })}
                            >
                              {month.label}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Year view */}
            <div hidden={api.view !== 'year'}>
              <div {...api.getViewControlProps({ view: 'year' })}>
                <button
                  {...api.getPrevTriggerProps({ view: 'year' })}
                  aria-label="Previous decade"
                >
                  {navIcon('M10 3 5 8l5 5')}
                </button>
                <button {...api.getViewTriggerProps({ view: 'year' })}>
                  {api.getDecade().start} – {api.getDecade().end}
                </button>
                <button
                  {...api.getNextTriggerProps({ view: 'year' })}
                  aria-label="Next decade"
                >
                  {navIcon('M6 3l5 5-5 5')}
                </button>
              </div>
              <table
                {...api.getTableProps({ view: 'year', columns: GRID_COLUMNS })}
              >
                <tbody {...api.getTableBodyProps()}>
                  {api
                    .getYearsGrid({ columns: GRID_COLUMNS })
                    .map((years, rowIndex) => (
                      <tr
                        key={rowIndex}
                        {...api.getTableRowProps({ view: 'year' })}
                      >
                        {years.map((year) => (
                          <td
                            key={year.value}
                            {...api.getYearTableCellProps({
                              ...year,
                              columns: GRID_COLUMNS,
                            })}
                          >
                            <div
                              {...api.getYearTableCellTriggerProps({
                                ...year,
                                columns: GRID_COLUMNS,
                              })}
                            >
                              {year.label}
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
      </Portal>
    </div>
  );
}
