import { useId } from 'react';
import type { ReactNode } from 'react';
import { progress } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface ProgressProps {
  /** Linear bar or circular ring. */
  variant?: 'linear' | 'circular';
  /** Optional label. */
  label?: ReactNode;
  /** Fill tone. */
  tone?: MantiTone;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Controlled value; pass `null` for an indeterminate state. */
  value?: number | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: number | null;
  min?: number;
  max?: number;
  /** Show the formatted value text. */
  showValue?: boolean;
  id?: string;
  className?: string;
}

/** A determinate/indeterminate progress indicator backed by the Zag.js progress
 * machine. Renders a linear bar or a circular ring. */
export function Progress({
  variant = 'linear',
  label,
  tone = 'primary',
  size = 'md',
  value,
  defaultValue,
  min,
  max,
  showValue,
  id,
  className,
}: ProgressProps) {
  const autoId = useId();
  const service = useMachine(progress.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    min,
    max,
  });
  const api = progress.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-variant={variant}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      {(label != null || showValue) && (
        <div data-part="header">
          {label != null && <span {...api.getLabelProps()}>{label}</span>}
          {showValue && (
            <span {...api.getValueTextProps()}>{api.valueAsString}</span>
          )}
        </div>
      )}
      {variant === 'circular' ? (
        <div data-part="circle-wrap">
          <svg {...api.getCircleProps()}>
            <circle {...api.getCircleTrackProps()} />
            <circle {...api.getCircleRangeProps()} />
          </svg>
          {showValue && (
            <span data-part="circle-text">{api.percentAsString}</span>
          )}
        </div>
      ) : (
        <div {...api.getTrackProps()}>
          <div {...api.getRangeProps()} />
        </div>
      )}
    </div>
  );
}
