import { useEffect, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { combobox } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';
import { ScrollArea } from '../ScrollArea/ScrollArea';

export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** The full option set; filtered client-side as the user types. */
  items: ComboboxItem[];
  /** Optional field label. */
  label?: ReactNode;
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
  /** Placement of the listbox relative to the control. */
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

/** A typeahead select backed by the Zag.js combobox machine. Filtering is
 * client-side over the `items` prop; the listbox is portalled. */
export function Combobox({
  items,
  label,
  placeholder = 'Search…',
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
}: ComboboxProps) {
  const autoId = useId();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? items.filter((item) => item.label.toLowerCase().includes(q))
      : items;
  }, [items, query]);
  const collection = useMemo(
    () =>
      combobox.collection({
        items: filtered,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [filtered],
  );
  const service = useMachine(combobox.machine, {
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
    // The listbox scrolls inside a Manti ScrollArea (the `ul` no longer scrolls
    // itself), so override Zag's default scroll-into-view: native scrollIntoView
    // walks up to the ScrollArea viewport — the nearest scrollable ancestor.
    scrollToIndexFn: (details) =>
      details.getElement()?.scrollIntoView({ block: 'nearest' }),
    onInputValueChange: (details) => setQuery(details.inputValue),
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = combobox.connect(service, normalizeProps);

  // Keep the selection (and its check indicator) in sync with the typed text:
  // the checked item is always the one whose label exactly matches the input.
  // Editing the text moves the check to a newly matching item, or removes it
  // when nothing matches — Zag otherwise keeps the old selection until the next
  // pick, leaving a stale check. Multi-select empties the input after every pick
  // by design, so it's skipped.
  useEffect(() => {
    if (multiple) return;
    const typed = api.inputValue.trim().toLowerCase();
    const match = typed
      ? items.find((item) => item.label.trim().toLowerCase() === typed)
      : undefined;
    if (match) {
      if (api.value[0] !== match.value) api.setValue([match.value]);
    } else if (api.value.length > 0) {
      // Drop the stale selection but keep the text being edited: setValue rewrites
      // the input under the default `replace` behavior, so restore it afterwards.
      const text = api.inputValue;
      api.setValue([]);
      api.setInputValue(text);
    }
  }, [api, items, multiple]);

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} placeholder={placeholder} />
        <button {...api.getTriggerProps()} aria-label="Toggle options">
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
        </button>
      </div>
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <ScrollArea focusable={false}>
              <ul {...api.getContentProps()}>
                {filtered.map((item) => (
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
    </div>
  );
}
