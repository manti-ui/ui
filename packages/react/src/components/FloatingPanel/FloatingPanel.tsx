import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { floatingPanel } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';

export interface FloatingPanelProps {
  /** Element that opens the panel. Cloned with the machine's trigger props. */
  trigger: ReactElement;
  /** Panel title. */
  title?: ReactNode;
  /** Panel body. */
  children: ReactNode;
  /** Allow dragging by the header. */
  draggable?: boolean;
  /** Allow edge/corner resizing. */
  resizable?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
}

const resizeAxes = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'] as const;

/** A draggable, resizable floating panel backed by the Zag.js floating-panel
 * machine. */
export function FloatingPanel({
  trigger,
  title,
  children,
  draggable = true,
  resizable = true,
  open,
  defaultOpen,
  onOpenChange,
  id,
  className,
}: FloatingPanelProps) {
  const autoId = useId();
  const service = useMachine(floatingPanel.machine, {
    id: id ?? autoId,
    draggable,
    resizable,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
  });
  const api = floatingPanel.connect(service, normalizeProps);

  return (
    <>
      {renderTrigger(trigger, api.getTriggerProps())}
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div {...api.getContentProps()} className={cx(className)}>
              <div {...api.getHeaderProps()}>
                <div {...api.getDragTriggerProps()}>
                  <span {...api.getTitleProps()}>{title}</span>
                </div>
                <button {...api.getCloseTriggerProps()} aria-label="Close">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 3.5l7 7M10.5 3.5l-7 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div {...api.getBodyProps()}>{children}</div>
              {resizable &&
                resizeAxes.map((axis) => (
                  <div key={axis} {...api.getResizeTriggerProps({ axis })} />
                ))}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
