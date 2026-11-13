import { useId } from 'react';
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
import { renderTrigger } from '../../internal/floating.js';
import type { Placement } from '../../internal/floating.js';
import { CloseIcon } from '../../internal/icons.js';

export interface PopoverProps {
  /** Element that toggles the popover. Cloned with the machine's trigger props. */
  trigger: ReactElement;
  /** Optional heading rendered at the top of the panel. */
  title?: ReactNode;
  /** Panel content. */
  children?: ReactNode;
  /** Placement relative to the trigger. */
  placement?: Placement;
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
