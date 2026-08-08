import { useId } from 'react';
import type { ReactNode, RefObject } from 'react';
import { tooltip } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { Portal } from '../../internal/Portal';
import { cx } from '../../internal/props';
import type { Placement } from '../../internal/floating';

export interface TooltipProps {
  /** The tooltip content. */
  content: ReactNode;
  /** The trigger element (wrapped in an inline trigger). */
  children: ReactNode;
  /** Delay before opening, in ms. */
  openDelay?: number;
  /** Delay before closing, in ms. */
  closeDelay?: number;
  /** Keep open while hovering the content. */
  interactive?: boolean;
  /** Placement relative to the trigger. */
  placement?: Placement;
  /** Render the arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Render the floating content through a portal. */
  portalled?: boolean;
  /** Optional portal target. */
  portalContainer?: RefObject<HTMLElement>;
  id?: string;
  className?: string;
}

/**
 * A floating label backed by the Zag.js tooltip machine. The machine handles
 * positioning, hover/focus delays, and dismissal; the content fades and lifts in
 * smoothly. The trigger is an inline wrapper, so any focusable child works.
 */
export function Tooltip({
  content,
  children,
  openDelay,
  closeDelay,
  interactive,
  placement,
  showArrow = true,
  open,
  defaultOpen,
  onOpenChange,
  portalled = false,
  portalContainer,
  id,
  className,
}: TooltipProps) {
  const autoId = useId();
  const service = useMachine(tooltip.machine, {
    id: id ?? autoId,
    openDelay,
    closeDelay,
    interactive,
    positioning: placement ? { placement } : undefined,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = tooltip.connect(service, normalizeProps);
  const floating = api.open ? (
    <div {...api.getPositionerProps()}>
      <div {...api.getContentProps()} className={cx(className)}>
        {showArrow && (
          <div {...api.getArrowProps()}>
            <div {...api.getArrowTipProps()} />
          </div>
        )}
        {content}
      </div>
    </div>
  ) : null;

  return (
    <>
      <span {...api.getTriggerProps()}>{children}</span>
      {portalled && floating ? (
        <Portal container={portalContainer}>{floating}</Portal>
      ) : (
        floating
      )}
    </>
  );
}
