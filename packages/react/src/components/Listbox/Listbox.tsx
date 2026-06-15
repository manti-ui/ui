import { useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { listbox } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface ListboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ListboxProps {
  /** The options. */
  items: ListboxItem[];
  /** Optional label above the list. */
  label?: ReactNode;
  /** Selected-item tone. */
  tone?: MantiTone;
  /** Single or multiple selection. */
  selectionMode?: 'single' | 'multiple';
  /** Controlled selected values. */
  value?: string[];
  /** Initial selected values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the selection changes. */
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
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

/** A selectable list backed by the Zag.js listbox machine. */
export function Listbox({
  items,
  label,
  tone = 'primary',
  selectionMode = 'single',
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  className,
}: ListboxProps) {
  const autoId = useId();
  const collection = useMemo(
    () =>
      listbox.collection({
        items,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [items],
  );
  const service = useMachine(listbox.machine, {
    id: id ?? autoId,
    collection,
    selectionMode,
    value,
    defaultValue,
    disabled,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = listbox.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <ul {...api.getContentProps()}>
        {items.map((item) => (
          <li key={item.value} {...api.getItemProps({ item })}>
            <span {...api.getItemTextProps({ item })}>{item.label}</span>
            <span {...api.getItemIndicatorProps({ item })}>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
