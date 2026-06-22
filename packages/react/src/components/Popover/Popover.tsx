import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { popover } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import type { Placement } from '../../internal/floating';
import { CloseIcon } from '../../internal/icons';

export interface PopoverProps {
  /** Element that toggles the popover. Cloned with the machine's trigger props. */
  trigger: ReactElement;
  /** Optional heading rendered at the top of the panel. */
  title?: ReactNode;
  /** Panel content. */
  children?: ReactNode;
  /** Placement relative to the trigger. */
  placement?: Placement;
  /** Render the arrow pointing at the trigger. */
  showArrow?: boolean;
  /** Show the corner close button. */
  showCloseButton?: boolean;
  /** Make the popover modal (trap focus, block outside interaction). */
  modal?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Close when clicking outside the content. @default true */
  closeOnInteractOutside?: boolean;
  /** Close when pressing Escape. @default true */
  closeOnEscape?: boolean;
  id?: string;
  className?: string;
}

/**
 * A floating panel anchored to a trigger, backed by the Zag.js popover machine.
 * The machine owns positioning, focus, and dismissal; this adapter renders the
 * translucent panel through a portal.
 */
export function Popover({
  trigger,
  title,
  children,
  placement = 'bottom',
  showArrow = true,
  showCloseButton = false,
  modal,
  open,
  defaultOpen,
  onOpenChange,
  closeOnInteractOutside,
  closeOnEscape,
  id,
  className,
}: PopoverProps) {
  const autoId = useId();
  const service = useMachine(popover.machine, {
    id: id ?? autoId,
    positioning: { placement },
    modal,
    open,
    defaultOpen,
    closeOnInteractOutside,
    closeOnEscape,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = popover.connect(service, normalizeProps);

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
              {title != null && <div {...api.getTitleProps()}>{title}</div>}
              {children != null && (
                <div {...api.getDescriptionProps()}>{children}</div>
              )}
              {showCloseButton && (
                <button {...api.getCloseTriggerProps()}>
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
