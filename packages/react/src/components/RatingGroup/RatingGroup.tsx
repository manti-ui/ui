import { useId } from 'react';
import type { ReactNode } from 'react';
import { ratingGroup } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface RatingGroupProps {
  /** Number of rating icons. */
  count?: number;
  /** Optional label. */
  label?: ReactNode;
  /** Filled-icon tone. */
  tone?: MantiTone;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Allow half-star precision. */
  allowHalf?: boolean;
  /** Controlled value. */
  value?: number;
  /** Initial value for uncontrolled usage. */
  defaultValue?: number;
  /** Called whenever the value changes. */
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

const star = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l2.9 6.26 6.1.51-4.64 4.02 1.4 6.21L12 16.9 6.24 19l1.4-6.21L3 8.77l6.1-.51L12 2z" />
  </svg>
);

/** A star rating backed by the Zag.js rating-group machine. */
export function RatingGroup({
  count = 5,
  label,
  tone = 'warning',
  size = 'md',
  allowHalf,
  value,
  defaultValue,
  onValueChange,
  readOnly,
  disabled,
  name,
  id,
  className,
}: RatingGroupProps) {
  const autoId = useId();
  const service = useMachine(ratingGroup.machine, {
    id: id ?? autoId,
    count,
    allowHalf,
    value,
    defaultValue,
    readOnly,
    disabled,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = ratingGroup.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        {api.items.map((index) => {
          const state = api.getItemState({ index });
          return (
            <span key={index} {...api.getItemProps({ index })}>
              <span data-part="star-bg">{star}</span>
              <span data-part="star-fill" data-half={state.half || undefined}>
                {star}
              </span>
            </span>
          );
        })}
      </div>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}
