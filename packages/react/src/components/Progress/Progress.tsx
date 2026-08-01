import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode, Ref, SVGAttributes } from 'react';
import { progress } from '@manti-ui/folds';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { WithDataAttributes } from '../../internal/props';

export interface ProgressProps {
  /** Linear bar or circular ring. */
  variant?: 'linear' | 'circular';
  /** Optional label. */
  label?: ReactNode;
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
  /** Native/ARIA/data props for the element with `role="progressbar"`. */
  rootProps?: WithDataAttributes<
    | Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>
    | Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role'>
  >;
}

/** A determinate/indeterminate progress indicator backed by the Zag.js progress
 * machine. Renders a linear bar or a circular ring. */
export const Progress = forwardRef<
  HTMLDivElement | SVGSVGElement,
  ProgressProps
>(function Progress(
  {
    variant = 'linear',
    label,
    size = 'md',
    value,
    defaultValue,
    min,
    max,
    showValue,
    id,
    className,
    rootProps,
  },
  ref,
) {
  const autoId = useId();
  const service = useMachine(progress.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    min,
    max,
  });
  const api = progress.connect(service, normalizeProps);
  const wrapperProps = api.getRootProps();
  const machineTrackProps = api.getTrackProps();
  const machineCircleProps = api.getCircleProps();
  const trackProps = {
    ...mergeProps(machineTrackProps, rootProps ?? {}),
    role: machineTrackProps.role,
    'aria-valuemin': machineTrackProps['aria-valuemin'],
    'aria-valuemax': machineTrackProps['aria-valuemax'],
    'aria-valuenow': machineTrackProps['aria-valuenow'],
  };
  const circleProps = {
    ...mergeProps(machineCircleProps, rootProps ?? {}),
    role: machineCircleProps.role,
    'aria-valuemin': machineCircleProps['aria-valuemin'],
    'aria-valuemax': machineCircleProps['aria-valuemax'],
    'aria-valuenow': machineCircleProps['aria-valuenow'],
  };

  return (
    <div
      {...wrapperProps}
      data-variant={variant}
      data-size={size}
      className={cx(className)}
    >
      {(label != null || (showValue && variant === 'linear')) && (
        <div data-part="header">
          {label != null && <span {...api.getLabelProps()}>{label}</span>}
          {showValue && variant === 'linear' && (
            <span {...api.getValueTextProps()}>{api.valueAsString}</span>
          )}
        </div>
      )}
      {variant === 'circular' ? (
        <div data-part="circle-wrap">
          <svg {...circleProps} ref={ref as Ref<SVGSVGElement>}>
            <circle {...api.getCircleTrackProps()} />
            <circle {...api.getCircleRangeProps()} />
          </svg>
          {showValue && (
            <span {...api.getValueTextProps()} data-part="circle-text">
              {api.valueAsString}
            </span>
          )}
        </div>
      ) : (
        <div {...trackProps} ref={ref as Ref<HTMLDivElement>}>
          <div {...api.getRangeProps()} />
        </div>
      )}
    </div>
  );
});
