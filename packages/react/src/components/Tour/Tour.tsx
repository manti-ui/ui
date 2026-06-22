import { useId, useMemo } from 'react';
import type { ReactElement } from 'react';
import { tour } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { renderTrigger } from '../../internal/floating';

/** Built-in navigation action a step button performs. */
export type TourStepActionType = 'next' | 'prev' | 'dismiss' | 'skip';

export interface TourStepAction {
  label: string;
  action: TourStepActionType;
}

export interface TourStep {
  id: string;
  /** CSS selector for the element to highlight. Omit for a centered step. */
  target?: string;
  title: string;
  description: string;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'center';
  /**
   * Action buttons for this step. Defaults to Back/Next, with the first step
   * dropping Back and the last step finishing the tour ("Done").
   */
  actions?: TourStepAction[];
}

export interface TourProps {
  /** The ordered steps. */
  steps: TourStep[];
  /** Element that starts the tour. Cloned with an onClick handler. */
  trigger: ReactElement;
  id?: string;
  className?: string;
}

/**
 * Sensible per-step defaults: Back appears on every step except the first;
 * the last step finishes the tour via `dismiss` (Zag disables `next` on the
 * last step), every other step advances with Next.
 */
function defaultStepActions(index: number, total: number): TourStepAction[] {
  const actions: TourStepAction[] = [];
  if (index > 0) actions.push({ label: 'Back', action: 'prev' });
  actions.push(
    index === total - 1
      ? { label: 'Done', action: 'dismiss' }
      : { label: 'Next', action: 'next' },
  );
  return actions;
}

/** A guided product tour backed by the Zag.js tour machine. */
export function Tour({ steps, trigger, id, className }: TourProps) {
  const autoId = useId();
  const resolvedSteps = useMemo(
    () =>
      steps.map((step, index) => ({
        id: step.id,
        // Zag requires a target or an explicit type; a targetless step is a
        // centered dialog, so tag it as such (otherwise Zag logs an error).
        // Targeted steps must OMIT `type` entirely — Zag's normalizeStep does
        // `{ type: 'tooltip', ...step }`, so a literal `type: undefined` would
        // overwrite the inferred 'tooltip' and silently disable the popper.
        ...(step.target ? null : { type: 'dialog' as const }),
        title: step.title,
        description: step.description,
        placement: step.placement,
        actions: step.actions ?? defaultStepActions(index, steps.length),
        target: step.target
          ? () => document.querySelector<HTMLElement>(step.target as string)
          : undefined,
      })),
    [steps],
  );
  const service = useMachine(tour.machine, {
    id: id ?? autoId,
    steps: resolvedSteps,
    translations: {
      progressText: ({ current, total }) => `${current + 1} of ${total}`,
    },
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
              <p {...api.getProgressTextProps()}>{api.getProgressText()}</p>
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
                {(step.actions ?? []).map((action) => (
                  <button
                    key={action.label}
                    {...api.getActionTriggerProps({ action })}
                    // Zag forces the dismiss action's aria-label to its "close"
                    // translation; keep the accessible name matching the
                    // visible label (WCAG 2.5.3).
                    aria-label={action.label}
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
