import { forwardRef, useId } from 'react';
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react';
import { switchMachine } from '@manti-ui/folds';
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import type { WithDataAttributes } from '../../internal/props';

export type SwitchRootProps = WithDataAttributes<
  Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>
>;
export type SwitchInputProps = WithDataAttributes<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'disabled' | 'name' | 'readOnly' | 'required'
  >
>;

export interface SwitchProps {
  /** Control size. */
  size?: 'sm' | 'md';
  /** Optional trailing label. */
  children?: ReactNode;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Called whenever the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  readOnly?: boolean;
  /** Form field name. */
  name?: string;
  /** Submitted value when checked. */
  value?: string | number;
  id?: string;
  className?: string;
  /** Props merged onto the wrapping label. Machine-owned behavior wins. */
  rootProps?: SwitchRootProps;
  /** Props merged onto the actual checkbox input used as the switch control. */
  inputProps?: SwitchInputProps;
}

/**
 * A smooth on/off control backed by the `@manti-ui/folds` Zag.js switch
 * machine. The machine owns state, keyboard, and form behavior; this adapter
 * only renders the anatomy.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = 'md',
    children,
    className,
    id,
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    invalid,
    required,
    readOnly,
    name,
    value,
    rootProps,
    inputProps,
  },
  ref,
) {
  const autoId = useId();
  const service = useMachine(switchMachine.machine, {
    id: id ?? autoId,
    checked,
    defaultChecked,
    disabled,
    invalid,
    required,
    readOnly,
    name,
    value,
    onCheckedChange: onCheckedChange
      ? (details) => onCheckedChange(details.checked)
      : undefined,
  });
  const api = switchMachine.connect(service, normalizeProps);
  const hasExplicitName =
    inputProps?.['aria-label'] != null ||
    inputProps?.['aria-labelledby'] != null;
  const machineInputProps = api.getHiddenInputProps();
  const mergedRootProps = mergeProps(rootProps ?? {}, api.getRootProps());
  const mergedInputProps = mergeProps(inputProps ?? {}, {
    ...machineInputProps,
    'aria-labelledby': hasExplicitName
      ? undefined
      : machineInputProps['aria-labelledby'],
  });

  return (
    <label
      {...mergedRootProps}
      data-size={size}
      className={cx(mergedRootProps.className, className)}
    >
      <input
        {...mergedInputProps}
        ref={ref}
        role="switch"
        data-part="hidden-input"
      />
      <span {...api.getControlProps()}>
        <span {...api.getThumbProps()} />
      </span>
      {children != null && <span {...api.getLabelProps()}>{children}</span>}
    </label>
  );
});
