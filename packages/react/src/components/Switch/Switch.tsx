import { useId } from 'react';
import type { ReactNode } from 'react';
import { switchMachine } from '@manti-ui/folds';
import type { MantiVariant } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface SwitchProps {
  /** Control size. */
  size?: 'sm' | 'md';
  /** Active variant when on. */
  variant?: MantiVariant;
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
}

/**
 * A smooth on/off control backed by the `@manti-ui/folds` Zag.js switch
 * machine. The machine owns state, keyboard, and form behavior; this adapter
 * only renders the anatomy.
 */
export function Switch({
  size = 'md',
  variant = 'primary',
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
}: SwitchProps) {
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

  return (
    <label
      {...api.getRootProps()}
      data-size={size}
      data-variant={variant}
      className={cx(className)}
    >
      <input {...api.getHiddenInputProps()} data-part="hidden-input" />
      <span {...api.getControlProps()}>
        <span {...api.getThumbProps()} />
      </span>
      {children != null && <span {...api.getLabelProps()}>{children}</span>}
    </label>
  );
}
