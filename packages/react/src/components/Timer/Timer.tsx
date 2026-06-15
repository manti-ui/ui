import { useId } from 'react';
import { timer } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

type TimerPart = 'days' | 'hours' | 'minutes' | 'seconds';

export interface TimerProps {
  /** Parts to display. */
  parts?: TimerPart[];
  /** Count down toward `targetMs` instead of up. */
  countdown?: boolean;
  /** Start offset, in milliseconds. */
  startMs?: number;
  /** Target, in milliseconds (for countdown). */
  targetMs?: number;
  /** Start automatically on mount. */
  autoStart?: boolean;
  /** Show start/pause/reset controls. */
  controls?: boolean;
  /** Called when a countdown reaches zero. */
  onComplete?: () => void;
  id?: string;
  className?: string;
}

const labels: Record<TimerPart, string> = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Min',
  seconds: 'Sec',
};

/** A count-up/count-down timer backed by the Zag.js timer machine. */
export function Timer({
  parts = ['hours', 'minutes', 'seconds'],
  countdown,
  startMs,
  targetMs,
  autoStart = true,
  controls,
  onComplete,
  id,
  className,
}: TimerProps) {
  const autoId = useId();
  const service = useMachine(timer.machine, {
    id: id ?? autoId,
    countdown,
    startMs,
    targetMs,
    autoStart,
    onComplete,
  });
  const api = timer.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} className={cx(className)}>
      <div {...api.getAreaProps()}>
        {parts.map((part, index) => (
          <div key={part} style={{ display: 'contents' }}>
            <div {...api.getItemProps({ type: part })}>
              <span {...api.getItemValueProps({ type: part })}>
                {api.formattedTime[part]}
              </span>
              <span {...api.getItemLabelProps({ type: part })}>
                {labels[part]}
              </span>
            </div>
            {index < parts.length - 1 && (
              <span {...api.getSeparatorProps()}>:</span>
            )}
          </div>
        ))}
      </div>
      {controls && (
        <div {...api.getControlProps()}>
          <button {...api.getActionTriggerProps({ action: 'start' })}>
            Start
          </button>
          <button {...api.getActionTriggerProps({ action: 'pause' })}>
            Pause
          </button>
          <button {...api.getActionTriggerProps({ action: 'reset' })}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
