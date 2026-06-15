import { useId } from 'react';
import type { ReactNode } from 'react';
import { steps } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
}

export interface StepsProps {
  /** The steps. */
  items: StepItem[];
  /** Active-step tone. */
  tone?: MantiTone;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Require steps to be completed in order. */
  linear?: boolean;
  /** Controlled active step index. */
  step?: number;
  /** Initial active step for uncontrolled usage. */
  defaultStep?: number;
  /** Called whenever the active step changes. */
  onStepChange?: (step: number) => void;
  /** Render the built-in prev/next controls. */
  controls?: boolean;
  id?: string;
  className?: string;
}

/** A step-by-step flow backed by the Zag.js steps machine. */
export function Steps({
  items,
  tone = 'primary',
  orientation = 'horizontal',
  linear,
  step,
  defaultStep,
  onStepChange,
  controls = true,
  id,
  className,
}: StepsProps) {
  const autoId = useId();
  const service = useMachine(steps.machine, {
    id: id ?? autoId,
    count: items.length,
    orientation,
    linear,
    step,
    defaultStep,
    onStepChange: onStepChange
      ? (details) => onStepChange(details.step)
      : undefined,
  });
  const api = steps.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      <div {...api.getListProps()}>
        {items.map((item, index) => (
          <div key={index} {...api.getItemProps({ index })}>
            <button {...api.getTriggerProps({ index })}>
              <span {...api.getIndicatorProps({ index })}>{index + 1}</span>
              <span data-part="item-content">
                <span data-part="item-title">{item.title}</span>
                {item.description != null && (
                  <span data-part="item-description">{item.description}</span>
                )}
              </span>
            </button>
            {index < items.length - 1 && (
              <div {...api.getSeparatorProps({ index })} />
            )}
          </div>
        ))}
      </div>

      {items.map((item, index) => (
        <div key={index} {...api.getContentProps({ index })}>
          {item.content}
        </div>
      ))}

      {controls && (
        <div data-part="controls">
          <button {...api.getPrevTriggerProps()}>Back</button>
          <button {...api.getNextTriggerProps()}>
            {api.hasNextStep ? 'Next' : 'Done'}
          </button>
        </div>
      )}
    </div>
  );
}
