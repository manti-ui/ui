import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { select } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { Portal } from '../../internal/Portal';
import { useFocusVisible } from '../../internal/focusVisible';
import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';
import { ScrollArea } from '../ScrollArea/ScrollArea';

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectVariant = 'default' | 'fill';

export interface SelectProps {
  /** The options. */
  items: SelectItem[];
  /** Optional field label. */
  label?: ReactNode;
  /** Text shown when nothing is selected. */
  placeholder?: string;
  /** Visual treatment for the trigger. */
  variant?: SelectVariant;
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
  /** Accessible name when no visible label is provided. */
  'aria-label'?: string;
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
  variant = 'default',
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
  'aria-label': ariaLabel,
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
  const triggerProps = api.getTriggerProps();
  const contentProps = api.getContentProps();
  const triggerSide = (
    triggerProps as typeof triggerProps & {
      'data-side'?: 'top' | 'bottom';
    }
  )['data-side'];
  const contentSide = (
    contentProps as typeof contentProps & { 'data-side'?: 'top' | 'bottom' }
  )['data-side'];
  const placementSide = placement.startsWith('top')
    ? 'top'
    : placement.startsWith('bottom')
      ? 'bottom'
      : undefined;
  const connectedSide =
    api.open && items.length > 0
      ? (triggerSide ?? contentSide ?? placementSide)
      : undefined;
  const focusVisibleProps = useFocusVisible<HTMLButtonElement>();

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-variant="primary"
      data-appearance={variant}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <button
          {...triggerProps}
          {...focusVisibleProps}
          aria-label={ariaLabel}
          aria-labelledby={
            ariaLabel != null ? undefined : triggerProps['aria-labelledby']
          }
          data-connected={connectedSide}
        >
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
          {/* The listbox is portalled out of the root, so the size cannot
              inherit: re-stamp it here and the size channel resolves the same
              rhythm for the rows as for the trigger. */}
          <div
            {...api.getPositionerProps()}
            data-variant="primary"
            data-size={size}
          >
            <ScrollArea focusable={false}>
              <ul {...contentProps}>
                {items.map((item) => (
                  <li key={item.value} {...api.getItemProps({ item })}>
                    <span {...api.getItemTextProps({ item })}>
                      {item.label}
                    </span>
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
