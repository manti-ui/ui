import { useId } from 'react';
import type { ReactNode } from 'react';
import { tagsInput } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface TagsInputProps {
  /** Optional field label. */
  label?: ReactNode;
  /** Focus-ring tone. */
  tone?: MantiTone;
  /** Controlled tag values. */
  value?: string[];
  /** Initial tag values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever the tag set changes. */
  onValueChange?: (value: string[]) => void;
  /** Maximum number of tags. */
  max?: number;
  /** Allow duplicate tags. */
  allowDuplicates?: boolean;
  /** Add a tag when pasting delimited text. */
  addOnPaste?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  required?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A multi-value entry field backed by the Zag.js tags-input machine. */
export function TagsInput({
  label,
  tone = 'primary',
  value,
  defaultValue,
  onValueChange,
  max,
  allowDuplicates,
  addOnPaste,
  placeholder,
  disabled,
  readOnly,
  invalid,
  required,
  name,
  id,
  className,
}: TagsInputProps) {
  const autoId = useId();
  const service = useMachine(tagsInput.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    max,
    allowDuplicates,
    addOnPaste,
    disabled,
    readOnly,
    invalid,
    required,
    name,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
  });
  const api = tagsInput.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        {api.value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            {...api.getItemProps({ index, value: tag })}
          >
            <span {...api.getItemPreviewProps({ index, value: tag })}>
              <span {...api.getItemTextProps({ index, value: tag })}>
                {tag}
              </span>
              <button
                {...api.getItemDeleteTriggerProps({ index, value: tag })}
                aria-label={`Remove ${tag}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3l6 6M9 3l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
            <input {...api.getItemInputProps({ index, value: tag })} />
          </span>
        ))}
        <input {...api.getInputProps()} placeholder={placeholder} />
      </div>
      <input {...api.getHiddenInputProps()} />
    </div>
  );
}
