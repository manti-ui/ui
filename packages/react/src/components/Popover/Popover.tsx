import { useId, useRef } from 'react';
import type {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import { popover } from '@manti-ui/folds';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { Portal } from '../../internal/Portal.js';
import { cx } from '../../internal/props.js';
import { renderTrigger, useFocusOrigin } from '../../internal/floating.js';
import type { GetAnchorRect, Placement } from '../../internal/floating.js';
import { CloseIcon } from '../../internal/icons.js';

export interface PopoverProps {
  /**
   * Element that toggles the popover. Cloned with the machine's trigger props.
   * Optional: without it, open the popover with `open` and place it with
   * `getAnchorRect`.
   */
  trigger?: ReactElement;
  /** Optional heading rendered at the top of the panel. */
  title?: ReactNode;
  /** Panel content. */
  children?: ReactNode;
  /** Placement relative to the trigger, or to the `getAnchorRect` rect. */
  placement?: Placement;
  /**
   * Place the panel at this rect (viewport coordinates) instead of the
   * trigger. Return `null` to fall back to the trigger.
   */
  getAnchorRect?: GetAnchorRect;
  /** Element to focus when the popover opens. Defaults to the first focusable element in the panel. */
  initialFocusEl?: () => HTMLElement | null;
  /**
   * Element to focus when the popover closes. Defaults to the trigger, or,
   * with no trigger, to the element that had focus when the popover opened.
   */
  finalFocusEl?: () => HTMLElement | null;
  /** Move focus back on close (to `finalFocusEl` or its default). @default true */
  restoreFocus?: boolean;
  /**
   * Elements outside the panel that count as inside it, so interacting with
   * them does not dismiss the popover.
   */
  persistentElements?: Array<() => Element | null>;
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
  /**
   * Panel width, written to `--manti-popover-width` on the content part. A
   * length set without `maxWidth` also lifts the default `20rem` cap to itself,
   * so `width="24rem"` renders 24rem wide (still clamped to the viewport). A
   * keyword such as `'fit-content'` keeps the default cap.
   * @default 'max-content'
   */
  width?: CSSProperties['width'];
  /**
   * Largest panel width, written to `--manti-popover-max-width` on the content
   * part. The panel never grows past the viewport less its gutter.
   * @default '20rem'
   */
  maxWidth?: CSSProperties['maxWidth'];
  /**
   * Attributes merged onto the content part. The machine's props win;
   * `className` and `style` compose with `className`, `width` and `maxWidth`.
   */
  contentProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
  id?: string;
  className?: string;
}

/** A number is a px length, as React reads it for `width`; a custom property is not. */
function toLength(value: string | number | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

/** A bare keyword (`auto`, `max-content`, `inherit`, …) names no length to lift the cap to. */
function isKeyword(value: string): boolean {
  return /^[a-z-]+$/i.test(value.trim());
}

/**
 * A floating panel anchored to a trigger, backed by the Zag.js popover machine.
 * The machine owns positioning, focus, and dismissal; this adapter renders the
 * translucent panel through a portal. The panel is arrowless by design — the
 * offset alone anchors it to the trigger.
 */
export function Popover({
  trigger,
  title,
  children,
  placement = 'bottom',
  getAnchorRect,
  initialFocusEl,
  finalFocusEl,
  restoreFocus,
  persistentElements,
  showCloseButton = false,
  modal,
  open,
  defaultOpen,
  onOpenChange,
  closeOnInteractOutside,
  closeOnEscape,
  width,
  maxWidth,
  contentProps,
  id,
  className,
}: PopoverProps) {
  const autoId = useId();
  // The machine refocuses its trigger on close; with no trigger it has none,
  // so it defaults to the element focused before the popover opened.
  const focusOrigin = useRef<HTMLElement | null>(null);
  const service = useMachine(popover.machine, {
    id: id ?? autoId,
    positioning: { placement, getAnchorRect },
    // `useMachine` drops undefined keys, so each unset option keeps the
    // machine's own default (notably `restoreFocus: true`).
    initialFocusEl,
    finalFocusEl:
      finalFocusEl ?? (trigger ? undefined : () => focusOrigin.current),
    restoreFocus,
    persistentElements,
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
  useFocusOrigin(focusOrigin, api.open);
  const sizeStyle: Record<string, string> = {};
  const widthValue = toLength(width);
  const maxWidthValue = toLength(maxWidth);
  if (widthValue != null) sizeStyle['--manti-popover-width'] = widthValue;
  // An explicit length `width` with no `maxWidth` must not be silently capped
  // at the default 20rem, so it becomes the cap too.
  const capValue =
    maxWidthValue ??
    (widthValue != null && !isKeyword(widthValue) ? widthValue : undefined);
  if (capValue != null) sizeStyle['--manti-popover-max-width'] = capValue;
  const content = mergeProps(contentProps ?? {}, api.getContentProps());

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div
              {...content}
              className={cx(contentProps?.className, className)}
              style={{ ...content.style, ...sizeStyle }}
            >
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
