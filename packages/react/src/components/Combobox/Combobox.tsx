import { useEffect, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { combobox } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { Portal } from '../../internal/Portal.js';
import { useFocusVisible } from '../../internal/focusVisible.js';
import { cx } from '../../internal/props.js';
import type { Placement } from '../../internal/floating.js';
import { ScrollArea } from '../ScrollArea/ScrollArea.js';
import { Spinner } from '../Spinner/Spinner.js';

export interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export type ComboboxVariant = 'default' | 'fill';

/**
 * How `items` is matched against the typed text. `false` renders `items` as
 * given, for a consumer that filters them itself (a remote search); a function
 * replaces the built-in case-insensitive label match.
 */
export type ComboboxFilter =
  | false
  | ((item: ComboboxItem, query: string) => boolean);

export interface ComboboxProps {
  /**
   * The option set. By default it is filtered client-side by label as the user
   * types; see `filter` to filter it yourself.
   */
  items: ComboboxItem[];
  /**
   * How `items` is matched against the typed text. Omit it for the built-in
   * label match; pass `false` when `items` is already filtered (a remote
   * search), or a function to match on something other than the label.
   */
  filter?: ComboboxFilter;
  /** Controlled text in the input. */
  inputValue?: string;
  /** Initial text in the input for uncontrolled usage. */
  defaultInputValue?: string;
  /** Called with the input's text on every edit, and when a pick rewrites it. */
  onInputValueChange?: (value: string) => void;
  /**
   * How many characters the typed text needs before typing opens the listbox.
   * The toggle button still opens it at any length.
   */
  minChars?: number;
  /** Show a loading row in the open listbox, announced to assistive tech. */
  loading?: boolean;
  /** Shown in the open listbox when it has no rows and is not loading. */
  emptyContent?: ReactNode;
  /** Optional field label. */
  label?: ReactNode;
  placeholder?: string;
  /** Visual treatment for the control. */
  variant?: ComboboxVariant;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * How many matching rows the listbox renders at once. The rest stay one
   * keystroke away: the input filters the whole `items` set, this only caps
   * what is put in the DOM, and a line under the list says how many are left.
   * Set it higher for a short, scannable catalogue; lower on a slow device.
   */
  maxVisibleItems?: number;
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

const clearIcon = (
  <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M4 4l8 8M12 4l-8 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const normalize = (text: string) => text.trim().toLowerCase();

const labelMatch = (item: ComboboxItem, query: string) => {
  const q = normalize(query);
  return !q || item.label.toLowerCase().includes(q);
};

/** A typeahead select backed by the Zag.js combobox machine. Filtering is
 * client-side over the `items` prop unless `filter` says otherwise; the
 * listbox is portalled. */
export function Combobox({
  items,
  filter,
  inputValue,
  defaultInputValue,
  onInputValueChange,
  minChars = 0,
  loading = false,
  emptyContent,
  label,
  placeholder = 'Search…',
  variant = 'default',
  size = 'md',
  maxVisibleItems = 200,
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
  const [typed, setTyped] = useState(defaultInputValue ?? '');
  const query = inputValue ?? typed;
  const controlled = value !== undefined;
  const filtered = useMemo(() => {
    if (filter === false) return items;
    const match = filter ?? labelMatch;
    return items.filter((item) => match(item, query));
  }, [items, query, filter]);
  // What actually reaches the DOM. A combobox over a few thousand options (a
  // font catalogue, a country list, an icon set) otherwise renders every row on
  // open: thousands of list items, each with a set of machine props, which
  // blocks the main thread for as long as it takes. The collection is built
  // from the same slice, so keyboard navigation never walks onto a row that is
  // not there.
  const visible = useMemo(
    () => filtered.slice(0, maxVisibleItems),
    [filtered, maxVisibleItems],
  );
  const hidden = filtered.length - visible.length;
  const collection = useMemo(
    () =>
      combobox.collection({
        items: visible,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [visible],
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
    inputValue,
    defaultInputValue,
    // Zag's `openOnChange` predicate is read before the edit lands, so it sees
    // the previous text. With `minChars`, opening on an edit is decided below,
    // from the text the edit produced.
    openOnChange: minChars <= 0,
    onInputValueChange: (details) => {
      setTyped(details.inputValue);
      onInputValueChange?.(details.inputValue);
      if (minChars > 0 && details.reason === 'input-change') {
        const long = details.inputValue.trim().length >= minChars;
        // Deferred: this runs inside the machine's own transition.
        queueMicrotask(() => {
          const current = combobox.connect(service, normalizeProps);
          if (long !== current.open) current.setOpen(long, 'input-change');
        });
      }
    },
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = combobox.connect(service, normalizeProps);
  const focusVisibleProps = useFocusVisible<HTMLDivElement>();

  // Keep the selection (and its check indicator) in sync with the typed text:
  // the checked item is always the one whose label exactly matches the input.
  // Editing the text moves the check to a newly matching item, or removes it
  // when nothing matches — Zag otherwise keeps the old selection until the next
  // pick, leaving a stale check. Multi-select empties the input after every pick
  // by design, so it's skipped.
  //
  // So is a controlled `value`, and that one is load-bearing: there, the owner
  // decides what is selected, and the machine cannot clear a value the prop
  // writes straight back. Running this against a controlled value spins —
  // `setValue([])` is undone by the prop, `setInputValue` re-fires the query,
  // the effect sees a selection again, and the render loop never settles.
  //
  // The pick itself is read from the machine, not from `items`: a consumer
  // filtering remotely replaces `items` on every fetch, and the picked item is
  // usually gone from the next result set while its label is still the text.
  useEffect(() => {
    if (multiple || controlled) return;
    const text = normalize(api.inputValue);
    const picked = api.selectedItems[0] as ComboboxItem | undefined;
    if (text && picked && normalize(picked.label) === text) return;
    const match = text
      ? items.find((item) => normalize(item.label) === text)
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
  }, [api, items, multiple, controlled]);

  const contentProps = api.getContentProps();
  const contentSide = (
    contentProps as typeof contentProps & { 'data-side'?: 'top' | 'bottom' }
  )['data-side'];
  const placementSide = placement.startsWith('top')
    ? 'top'
    : placement.startsWith('bottom')
      ? 'bottom'
      : undefined;
  // Besides the rows, the popup can carry a loading row or the empty content
  // alone; either one is a body, so the popup shows and joins the trigger seam.
  const showEmpty = !loading && visible.length === 0 && emptyContent != null;
  const hasBody = visible.length > 0 || loading || showEmpty;
  const connectedSide =
    api.open && hasBody ? (contentSide ?? placementSide) : undefined;

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-variant="primary"
      data-appearance={variant}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div
        {...api.getControlProps()}
        {...focusVisibleProps}
        data-connected={connectedSide}
      >
        {multiple &&
          api.value.map((val) => {
            // A remote search replaces `items`, so fall back to the item the
            // machine kept from the moment it was picked.
            const item =
              items.find((i) => i.value === val) ??
              (api.selectedItems as ComboboxItem[]).find(
                (i) => i.value === val,
              );
            const text = item?.label ?? val;
            return (
              <span key={val} data-scope="combobox" data-part="chip">
                {text}
                <button
                  type="button"
                  data-scope="combobox"
                  data-part="chip-remove"
                  aria-label={`Remove ${text}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() =>
                    api.setValue(api.value.filter((v) => v !== val))
                  }
                >
                  {clearIcon}
                </button>
              </span>
            );
          })}
        <input
          {...api.getInputProps()}
          placeholder={multiple && api.value.length > 0 ? '' : placeholder}
        />
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
          {/* The listbox is portalled out of the root, so the size cannot
              inherit: re-stamp it here and the size channel resolves the same
              rhythm for the rows as for the input. */}
          <div
            {...api.getPositionerProps()}
            data-variant="primary"
            data-size={size}
          >
            <ScrollArea focusable={false}>
              <ul {...contentProps}>
                {visible.map((item) => (
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
              {loading && (
                <div data-scope="combobox" data-part="loading" role="status">
                  <Spinner aria-hidden="true" />
                  Loading…
                </div>
              )}
              {showEmpty && (
                <div data-scope="combobox" data-part="empty" role="status">
                  {emptyContent}
                </div>
              )}
              {hidden > 0 && (
                <p data-scope="combobox" data-part="overflow-hint">
                  {hidden} more. Keep typing to narrow the list.
                </p>
              )}
            </ScrollArea>
          </div>
        </Portal>
      )}
    </div>
  );
}
