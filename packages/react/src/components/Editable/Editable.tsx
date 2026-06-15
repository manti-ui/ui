import { useId } from 'react';
import type { ReactNode } from 'react';
import { editable } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface EditableProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Focus-ring tone. */
  tone?: MantiTone;
  /** Controlled value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called whenever the value changes. */
  onValueChange?: (value: string) => void;
  /** Called when the value is committed (Enter/blur/submit). */
  onValueCommit?: (value: string) => void;
  /** What enters edit mode. */
  activationMode?: 'focus' | 'dblclick' | 'click' | 'none';
  /** What commits the value. */
  submitMode?: 'enter' | 'blur' | 'both' | 'none';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** An inline text field that toggles between preview and edit, backed by the
 * Zag.js editable machine. */
export function Editable({
  label,
  tone = 'primary',
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  activationMode,
  submitMode,
  placeholder,
  disabled,
  readOnly,
  required,
  invalid,
  name,
  id,
  className,
}: EditableProps) {
  const autoId = useId();
  const service = useMachine(editable.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    activationMode,
    submitMode,
    placeholder,
    disabled,
    readOnly,
    required,
    invalid,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
    onValueCommit: onValueCommit
      ? (details) => onValueCommit(details.value)
      : undefined,
  });
  const api = editable.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getAreaProps()}>
        <input {...api.getInputProps()} />
        <span {...api.getPreviewProps()} />
      </div>
      <div {...api.getControlProps()}>
        {api.editing ? (
          <>
            <button {...api.getSubmitTriggerProps()}>Save</button>
            <button {...api.getCancelTriggerProps()}>Cancel</button>
          </>
        ) : (
          <button {...api.getEditTriggerProps()}>Edit</button>
        )}
      </div>
    </div>
  );
}
