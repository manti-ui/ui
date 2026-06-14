import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { hoverCard } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import type { Placement } from '../../internal/floating';

export interface HoverCardProps {
  /** Element that reveals the card on hover/focus. Cloned with trigger props. */
  trigger: ReactElement;
  /** Card content. */
  children?: ReactNode;
  /** Placement relative to the trigger. */
  placement?: Placement;
  /** Render the arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Delay before opening, in ms. */
  openDelay?: number;
  /** Delay before closing, in ms. */
  closeDelay?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
}

/**
 * A rich floating preview revealed on hover or focus, backed by the Zag.js
 * hover-card machine. The machine owns the open/close delays and positioning;
 * this adapter renders the frosted panel through a portal.
 */
export function HoverCard({
  trigger,
  children,
  placement = 'bottom',
  showArrow = true,
  openDelay,
  closeDelay,
  open,
  defaultOpen,
  onOpenChange,
  id,
  className,
}: HoverCardProps) {
  const autoId = useId();
  const service = useMachine(hoverCard.machine, {
    id: id ?? autoId,
    positioning: { placement },
    openDelay,
    closeDelay,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = hoverCard.connect(service, normalizeProps);

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div {...api.getContentProps()} className={cx(className)}>
              {showArrow && (
                <div {...api.getArrowProps()}>
                  <div {...api.getArrowTipProps()} />
                </div>
              )}
              {children}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
