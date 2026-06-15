import { useId, useMemo } from 'react';
import type { ReactElement } from 'react';
import { tour } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';

export interface TourStep {
  id: string;
  /** CSS selector for the element to highlight. Omit for a centered step. */
  target?: string;
  title: string;
  description: string;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'bottom-start'
    | 'center';
}

export interface TourProps {
  /** The ordered steps. */
  steps: TourStep[];
  /** Element that starts the tour. Cloned with an onClick handler. */
  trigger: ReactElement;
  id?: string;
  className?: string;
}

const defaultActions = [
  { label: 'Back', action: 'prev' as const },
  { label: 'Next', action: 'next' as const },
];

/** A guided product tour backed by the Zag.js tour machine. */
export function Tour({ steps, trigger, id, className }: TourProps) {
  const autoId = useId();
  const resolvedSteps = useMemo(
    () =>
      steps.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        placement: step.placement,
        actions: defaultActions,
        target: step.target
          ? () => document.querySelector<HTMLElement>(step.target as string)
          : undefined,
      })),
    [steps],
  );
  const service = useMachine(tour.machine, {
    id: id ?? autoId,
    steps: resolvedSteps,
  });
  const api = tour.connect(service, normalizeProps);
  const step = api.step;

  return (
    <>
      {renderTrigger(trigger, { onClick: () => api.start() })}
      {api.open && step != null && (
        <Portal>
          {step.backdrop !== false && <div {...api.getBackdropProps()} />}
          <div {...api.getSpotlightProps()} />
          <div {...api.getPositionerProps()}>
            <div {...api.getContentProps()} className={cx(className)}>
              <p {...api.getProgressTextProps()} />
              <p {...api.getTitleProps()}>{step.title}</p>
              <p {...api.getDescriptionProps()}>{step.description}</p>
              <div {...api.getArrowProps()}>
                <div {...api.getArrowTipProps()} />
              </div>
              <button {...api.getCloseTriggerProps()} aria-label="Close tour">
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
              <div data-part="actions">
                {(step.actions ?? defaultActions).map((action) => (
                  <button
                    key={action.label}
                    {...api.getActionTriggerProps({ action })}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
