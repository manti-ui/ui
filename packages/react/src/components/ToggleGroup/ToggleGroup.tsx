import { useId } from 'react';
import type { ReactNode } from 'react';
import { toggleGroup } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface ToggleGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  /** The options. */
  items: ToggleGroupItem[];
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Active tone for pressed items. */
  tone?: MantiTone;
  /** Allow more than one item to be pressed at once. */
  multiple?: boolean;
  /** Controlled pressed values. */
  value?: string[];
  /** Initial pressed values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the pressed set changes. */
  onValueChange?: (value: string[]) => void;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** A set of toggle buttons backed by the Zag.js toggle-group machine. */
export function ToggleGroup({
  items,
  size = 'md',
  tone = 'primary',
  multiple,
  value,
  defaultValue,
  onValueChange,
  orientation,
  disabled,
  id,
  className,
}: ToggleGroupProps) {
  const autoId = useId();
  const service = useMachine(toggleGroup.machine, {
    id: id ?? autoId,
    multiple,
    value,
    defaultValue,
    orientation,
    disabled,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = toggleGroup.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      {items.map((item) => (
        <button
          key={item.value}
          {...api.getItemProps({ value: item.value, disabled: item.disabled })}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
