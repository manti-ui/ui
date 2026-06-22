import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { dialog } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';
import { CloseIcon } from '../../internal/icons';

export type DialogSize = 'sm' | 'md' | 'lg';

/** Helpers passed to render-prop slots so consumers can dismiss the dialog. */
export interface DialogRenderProps {
  /** Close the dialog. */
  close: () => void;
}

type DialogSlot = ReactNode | ((props: DialogRenderProps) => ReactNode);

export interface DialogProps {
  /** Element that opens the dialog. Cloned with the machine's trigger props. */
  trigger?: ReactElement;
  /** Heading shown at the top of the dialog. */
  title?: ReactNode;
  /** Supporting copy rendered under the title. */
  description?: ReactNode;
  /** Dialog body. Accepts a render function receiving `{ close }`. */
  children?: DialogSlot;
  /**
   * Footer content, typically actions, pinned to the trailing edge. Accepts a
   * render function receiving `{ close }` so action buttons can dismiss the
   * dialog (e.g. `footer={({ close }) => <Button onClick={close}>Cancel</Button>}`).
   */
  footer?: DialogSlot;
  /** Width preset. */
  size?: DialogSize;
  /** Render an `alertdialog` instead of a `dialog`. */
  role?: 'dialog' | 'alertdialog';
  /** Show the corner close button. */
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
 * A modal surface backed by the Zag.js dialog machine. The machine owns focus
 * trapping, scroll locking, and dismissal; this adapter renders the translucent
 * panel anatomy through a portal.
 */
export function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md',
  role,
  showCloseButton = true,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  closeOnInteractOutside,
  closeOnEscape,
  id,
  className,
}: DialogProps) {
  const autoId = useId();
  const service = useMachine(dialog.machine, {
    id: id ?? autoId,
    role,
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
  const renderProps: DialogRenderProps = { close: () => api.setOpen(false) };
  const renderSlot = (slot: DialogSlot) =>
    typeof slot === 'function' ? slot(renderProps) : slot;

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getBackdropProps()} />
          <div {...api.getPositionerProps()}>
            <div
              {...api.getContentProps()}
              data-size={size}
              className={cx(className)}
            >
              {showCloseButton && (
                <button {...api.getCloseTriggerProps()}>
                  <CloseIcon />
                </button>
              )}
              {title != null && <h2 {...api.getTitleProps()}>{title}</h2>}
              {description != null && (
                <p {...api.getDescriptionProps()}>{description}</p>
              )}
              {children != null && (
                <div data-scope="dialog" data-part="body">
                  {renderSlot(children)}
                </div>
              )}
              {footer != null && (
                <div data-scope="dialog" data-part="footer">
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
