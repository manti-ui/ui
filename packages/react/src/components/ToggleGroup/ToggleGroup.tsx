import { useId } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { toggleGroup } from '@manti-ui/folds';
import type { MantiVariant } from '@manti-ui/tokens';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { WithDataAttributes } from '../../internal/props';

export interface ToggleGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Props merged onto this item's button. Machine semantics win. */
  itemProps?: WithDataAttributes<
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'>
  >;
}

interface ToggleGroupCommonProps {
  /** The options. */
  items: ToggleGroupItem[];
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Active variant for pressed items. */
  variant?: MantiVariant;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  id?: string;
  className?: string;
  rootProps?: WithDataAttributes<
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>
  >;
  getItemProps?: (
    item: ToggleGroupItem,
  ) => WithDataAttributes<
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'>
  >;
}

export interface ToggleGroupSingleProps extends ToggleGroupCommonProps {
  type: 'single';
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface ToggleGroupMultipleProps extends ToggleGroupCommonProps {
  type: 'multiple';
  multiple?: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/** @deprecated Prefer the discriminated `type="single" | "multiple"` API. */
export interface ToggleGroupLegacyProps extends ToggleGroupCommonProps {
  type?: undefined;
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupProps =
  | ToggleGroupSingleProps
  | ToggleGroupMultipleProps
  | ToggleGroupLegacyProps;

/** A set of toggle buttons backed by the Zag.js toggle-group machine. */
export function ToggleGroup(props: ToggleGroupProps) {
  const {
    items,
    size = 'md',
    variant = 'primary',
    orientation,
    disabled,
    id,
    className,
    rootProps,
    getItemProps,
  } = props;
  const autoId = useId();
  const scalarSingle = props.type === 'single';
  const multiple =
    props.type === 'multiple'
      ? true
      : props.type === 'single'
        ? false
        : props.multiple;
  const value = scalarSingle
    ? props.value == null
      ? undefined
      : [props.value]
    : props.value;
  const defaultValue = scalarSingle
    ? props.defaultValue == null
      ? undefined
      : [props.defaultValue]
    : props.defaultValue;
  const service = useMachine(toggleGroup.machine, {
    id: id ?? autoId,
    multiple,
    value,
    defaultValue,
    orientation,
    disabled,
    onValueChange: props.onValueChange
      ? (details) => {
          if (scalarSingle) {
            (props.onValueChange as (value: string) => void)(
              details.value[0] ?? '',
            );
          } else {
            (props.onValueChange as (value: string[]) => void)(details.value);
          }
        }
      : undefined,
  });
  const api = toggleGroup.connect(service, normalizeProps);
  const mergedRootProps = mergeProps(rootProps ?? {}, api.getRootProps());

  return (
    <div
      {...mergedRootProps}
      data-size={size}
      data-variant={variant}
      className={cx(mergedRootProps.className, className)}
    >
      {items.map((item) => {
        const itemProps = mergeProps(
          item.itemProps ?? {},
          getItemProps?.(item) ?? {},
          api.getItemProps({ value: item.value, disabled: item.disabled }),
        );
        return (
          <button key={item.value} {...itemProps}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
