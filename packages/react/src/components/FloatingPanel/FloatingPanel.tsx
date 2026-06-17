import { useId, useRef, useState } from 'react';
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

const iconProps = {
  width: 14,
  height: 14,
  viewBox: '0 0 14 14',
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
} as const;

const minimizeIcon = (
  <svg {...iconProps}>
    <path d="M3.5 9.5h7" strokeLinecap="round" />
  </svg>
);

const maximizeIcon = (
  <svg {...iconProps}>
    <rect x="3.25" y="3.25" width="7.5" height="7.5" rx="1.25" />
  </svg>
);

const restoreIcon = (
  <svg {...iconProps}>
    <rect x="3" y="5" width="6" height="6" rx="1.25" />
    <path
      d="M5.5 5V4.25A1.25 1.25 0 0 1 6.75 3h4A1.25 1.25 0 0 1 12 4.25v4A1.25 1.25 0 0 1 10.75 9.5H10"
      strokeLinecap="round"
    />
  </svg>
);

const closeIcon = (
  <svg {...iconProps}>
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" strokeLinecap="round" />
  </svg>
);

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
  // The Zag api exposes minimize/maximize/restore actions but not the current
  // stage, so mirror it locally to wire "click the minimized header to restore".
  const [minimized, setMinimized] = useState(false);
  // The header stays draggable while minimized, so a drag ends with a synthetic
  // click. Remember where the press started to tell a real click from a drag.
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const service = useMachine(floatingPanel.machine, {
    id: id ?? autoId,
    draggable,
    resizable,
    open,
    defaultOpen,
    onOpenChange: onOpenChange
      ? (details) => onOpenChange(details.open)
      : undefined,
    onStageChange: (details) => setMinimized(details.stage === 'minimized'),
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
                <div
                  {...api.getDragTriggerProps()}
                  onPointerDownCapture={
                    minimized
                      ? (event) => {
                          pressStart.current = {
                            x: event.clientX,
                            y: event.clientY,
                          };
                        }
                      : undefined
                  }
                  onClick={
                    minimized
                      ? (event) => {
                          const start = pressStart.current;
                          // Restore only on a genuine click, not a drag release.
                          if (
                            start &&
                            Math.hypot(
                              event.clientX - start.x,
                              event.clientY - start.y,
                            ) < 4
                          ) {
                            api.restore();
                          }
                        }
                      : undefined
                  }
                >
                  <span {...api.getTitleProps()}>{title}</span>
                </div>
                <div {...api.getControlProps()}>
                  <button {...api.getStageTriggerProps({ stage: 'minimized' })}>
                    {minimizeIcon}
                  </button>
                  <button {...api.getStageTriggerProps({ stage: 'maximized' })}>
                    {maximizeIcon}
                  </button>
                  <button {...api.getStageTriggerProps({ stage: 'default' })}>
                    {restoreIcon}
                  </button>
                  <button {...api.getCloseTriggerProps()} aria-label="Close">
                    {closeIcon}
                  </button>
                </div>
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
