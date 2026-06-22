import { useId } from 'react';
import type { ReactNode } from 'react';
import { tabs } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export type TabsVariant = 'line' | 'pill' | 'soft';

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** The tabs. */
  items: TabItem[];
  /**
   * Visual style.
   * - `line` (default): a rail under the active tab.
   * - `pill`: a translucent segmented control with a sliding translucent thumb.
   * - `soft`: a translucent pill on the active tab, no enclosing track.
   */
  variant?: TabsVariant;
  /** Active tone for the selected tab and indicator. */
  tone?: MantiTone;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value. Defaults to the first item. */
  defaultValue?: string;
  /** Called whenever the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  id?: string;
  className?: string;
}

/** Tabbed navigation backed by the Zag.js tabs machine. */
export function Tabs({
  items,
  variant = 'line',
  tone = 'primary',
  value,
  defaultValue,
  onValueChange,
  orientation,
  id,
  className,
}: TabsProps) {
  const autoId = useId();
  const service = useMachine(tabs.machine, {
    id: id ?? autoId,
    value,
    defaultValue: defaultValue ?? items[0]?.value,
    orientation,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = tabs.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-variant={variant}
      data-tone={tone}
      className={cx(className)}
    >
      <div {...api.getListProps()}>
        {items.map((item) => (
          <button
            key={item.value}
            {...api.getTriggerProps({
              value: item.value,
              disabled: item.disabled,
            })}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <span {...api.getIndicatorProps()} />
      </div>
      {items.map((item) => (
        <div key={item.value} {...api.getContentProps({ value: item.value })}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
