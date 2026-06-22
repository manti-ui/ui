import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { dialog } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import { CloseIcon } from '../../internal/icons';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

/** Helpers passed to render-prop slots so consumers can dismiss the drawer. */
export interface DrawerRenderProps {
  /** Close the drawer. */
  close: () => void;
}

type DrawerSlot = ReactNode | ((props: DrawerRenderProps) => ReactNode);

export interface DrawerProps {
  /** Element that opens the drawer. Cloned with the machine's trigger props. */
  trigger?: ReactElement;
  /** Heading shown at the top of the drawer. */
  title?: ReactNode;
  /** Supporting copy rendered under the title. */
  description?: ReactNode;
  /** Drawer body. Accepts a render function receiving `{ close }`. */
  children?: DrawerSlot;
  /**
   * Footer content, typically actions, pinned to the bottom. Accepts a render
   * function receiving `{ close }` so action buttons can dismiss the drawer.
   */
  footer?: DrawerSlot;
  /** Edge the drawer slides in from. @default 'right' */
  placement?: DrawerPlacement;
  /** Extent of the panel along its axis (width for left/right, height for top/bottom). */
  size?: DrawerSize;
  /** Show the corner close button. @default true */
  showCloseButton?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Trap pointer interaction and hide content below. @default true */
  modal?: boolean;
  /** Close when clicking outside the content. @default true */
  closeOnInteractOutside?: boolean;
  /** Close when pressing Escape. @default true */
  closeOnEscape?: boolean;
  id?: string;
  className?: string;
}

/**
 * An edge-anchored panel backed by the Zag.js dialog machine — the same focus
 * trapping, scroll locking, and dismissal as {@link Dialog}, restyled to slide
 * in from a screen edge. The dialog parts are re-scoped to `drawer` so the
 * drawer CSS owns the positioning and slide motion.
 */
export function Drawer({
  trigger,
  title,
  description,
  children,
  footer,
  placement = 'right',
  size = 'md',
  showCloseButton = true,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  closeOnInteractOutside,
  closeOnEscape,
  id,
  className,
}: DrawerProps) {
  const autoId = useId();
  const service = useMachine(dialog.machine, {
    id: id ?? autoId,
    open,
    defaultOpen,
    modal,
    closeOnInteractOutside,
    closeOnEscape,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = dialog.connect(service, normalizeProps);
  const renderProps: DrawerRenderProps = { close: () => api.setOpen(false) };
  const renderSlot = (slot: DrawerSlot) =>
    typeof slot === 'function' ? slot(renderProps) : slot;

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getBackdropProps()} data-scope="drawer" />
          <div
            {...api.getPositionerProps()}
            data-scope="drawer"
            data-placement={placement}
          >
            <div
              {...api.getContentProps()}
              data-scope="drawer"
              data-placement={placement}
              data-size={size}
              className={cx(className)}
            >
              {showCloseButton && (
                <button {...api.getCloseTriggerProps()} data-scope="drawer">
                  <CloseIcon />
                </button>
              )}
              {title != null && (
                <h2 {...api.getTitleProps()} data-scope="drawer">
                  {title}
                </h2>
              )}
              {description != null && (
                <p {...api.getDescriptionProps()} data-scope="drawer">
                  {description}
                </p>
              )}
              {children != null && (
                <div data-scope="drawer" data-part="body">
                  {renderSlot(children)}
                </div>
              )}
              {footer != null && (
                <div data-scope="drawer" data-part="footer">
                  {renderSlot(footer)}
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
