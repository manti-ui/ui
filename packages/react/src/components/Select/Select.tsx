import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { select } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';
import { ScrollArea } from '../ScrollArea/ScrollArea';

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** The options. */
  items: SelectItem[];
  /** Optional field label. */
  label?: ReactNode;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Selected-item tone. */
  tone?: MantiTone;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Allow selecting more than one option. */
  multiple?: boolean;
  /** Controlled selected values. */
  value?: string[];
  /** Initial selected values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the selection changes. */
  onValueChange?: (value: string[]) => void;
  /** Placement of the listbox relative to the trigger. */
  placement?: Placement;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

const check = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3.5 8.5l3 3 6-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A single/multi select backed by the Zag.js select machine. The machine owns
 * keyboard, typeahead, and dismissal; this adapter renders the trigger and the
 * portalled translucent listbox. */
export function Select({
  items,
  label,
  placeholder = 'Select…',
  tone = 'primary',
  size = 'md',
  multiple,
  value,
  defaultValue,
  onValueChange,
  placement = 'bottom-start',
  disabled,
  invalid,
  required,
  name,
  id,
  className,
}: SelectProps) {
  const autoId = useId();
  const collection = useMemo(
    () =>
      select.collection({
        items,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [items],
  );
  const service = useMachine(select.machine, {
    id: id ?? autoId,
    collection,
    multiple,
    value,
    defaultValue,
    disabled,
    invalid,
    required,
    name,
    positioning: { placement, sameWidth: true },
    // The listbox scrolls inside a Manti ScrollArea, so override Zag's default
    // scroll-into-view: native scrollIntoView walks up to the ScrollArea
    // viewport — the nearest scrollable ancestor.
    scrollToIndexFn: (details) =>
      details.getElement()?.scrollIntoView({ block: 'nearest' }),
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = select.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <button {...api.getTriggerProps()}>
          <span
            {...api.getValueTextProps()}
            data-placeholder={api.empty || undefined}
          >
            {api.empty ? placeholder : api.valueAsString}
          </span>
          <span {...api.getIndicatorProps()}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 6l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <ScrollArea focusable={false}>
              <ul {...api.getContentProps()}>
                {items.map((item) => (
                  <li key={item.value} {...api.getItemProps({ item })}>
                    <span {...api.getItemTextProps({ item })}>{item.label}</span>
                    <span {...api.getItemIndicatorProps({ item })}>
                      {check}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </Portal>
      )}
      <select {...api.getHiddenSelectProps()}>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
