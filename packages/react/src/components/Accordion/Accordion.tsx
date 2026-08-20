import { useId } from 'react';
import type { ReactNode } from 'react';
import { accordion } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** The disclosure items. */
  items: AccordionItem[];
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  /** Allow closing the open panel (single mode). Defaults to true. */
  collapsible?: boolean;
  /** Controlled open values. */
  value?: string[];
  /** Initial open values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the open set changes. */
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const Chevron = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A stack of disclosures backed by the Zag.js accordion machine. */
export function Accordion({
  items,
  multiple,
  collapsible = true,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  className,
}: AccordionProps) {
  const autoId = useId();
  const service = useMachine(accordion.machine, {
    id: id ?? autoId,
    multiple,
    collapsible,
    value,
    defaultValue,
    disabled,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = accordion.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} className={cx(className)}>
      {items.map((item) => {
        const itemProps = { value: item.value, disabled: item.disabled };
        return (
          <div key={item.value} {...api.getItemProps(itemProps)}>
            <h3 data-scope="accordion" data-part="item-heading">
              <button {...api.getItemTriggerProps(itemProps)}>
                {item.title}
                <span {...api.getItemIndicatorProps(itemProps)}>{Chevron}</span>
              </button>
            </h3>
            <div {...api.getItemContentProps(itemProps)}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );
}
