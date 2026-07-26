import { useId } from 'react';
import type { ReactNode } from 'react';
import { collapsible } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

const CollapseChevron = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      d="m7 4 5 5 5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m7 20 5-5 5 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExpandChevron = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      d="m7 9 5-5 5 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m7 15 5 5 5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CollapsibleProps {
  /** Trigger content. */
  trigger: ReactNode;
  /** Trailing indicator. Defaults to the state-aware Manti icon; pass `false` to hide it. */
  indicator?: ReactNode | false;
  /** Collapsible content. */
  children?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * A single open/close disclosure backed by the Zag.js collapsible machine. The
 * content animates its height smoothly via the machine's `--height` variable.
 */
export function Collapsible({
  trigger,
  indicator,
  children,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  id,
  className,
}: CollapsibleProps) {
  const autoId = useId();
  const service = useMachine(collapsible.machine, {
    id: id ?? autoId,
    open,
    defaultOpen,
    disabled,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = collapsible.connect(service, normalizeProps);
  const resolvedIndicator =
    indicator === undefined
      ? api.open
        ? ExpandChevron
        : CollapseChevron
      : indicator;

  return (
    <div {...api.getRootProps()} className={cx(className)}>
      <button {...api.getTriggerProps()}>
        {trigger}
        {resolvedIndicator !== false && resolvedIndicator != null && (
          <span data-scope="collapsible" data-part="indicator" aria-hidden>
            {resolvedIndicator}
          </span>
        )}
      </button>
      <div {...api.getContentProps()}>{children}</div>
    </div>
  );
}
