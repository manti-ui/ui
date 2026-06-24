import { useId } from 'react';
import type { ReactNode } from 'react';
import { fileUpload } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface FileUploadProps {
  /** Optional label. */
  label?: ReactNode;
  /** Dropzone hint text. */
  hint?: ReactNode;
  /** Browse-button label. */
  triggerLabel?: ReactNode;
  /** Accent tone. */
  tone?: MantiTone;
  /** Accepted MIME types / extensions. */
  accept?: string | string[];
  /** Maximum number of files. */
  maxFiles?: number;
  /** Maximum size per file, in bytes. */
  maxFileSize?: number;
  /** Called whenever the accepted file list changes. */
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A file dropzone with previews backed by the Zag.js file-upload machine. */
export function FileUpload({
  label,
  hint = 'Drag files here or browse',
  triggerLabel = 'Browse files',
  tone = 'primary',
  accept,
  maxFiles,
  maxFileSize,
  onFilesChange,
  disabled,
  name,
  id,
  className,
}: FileUploadProps) {
  const autoId = useId();
  const service = useMachine(fileUpload.machine, {
    id: id ?? autoId,
    accept,
    maxFiles,
    maxFileSize,
    disabled,
    name,
    onFileChange: onFilesChange
      ? (details) => onFilesChange(details.acceptedFiles)
      : undefined,
  });
  const api = fileUpload.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getDropzoneProps()}>
        <span data-part="hint">{hint}</span>
        <button {...api.getTriggerProps()}>{triggerLabel}</button>
      </div>
      <input {...api.getHiddenInputProps()} />
      {api.acceptedFiles.length > 0 && (
        <ul {...api.getItemGroupProps()}>
          {api.acceptedFiles.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              {...api.getItemProps({ file })}
            >
              <span {...api.getItemNameProps({ file })}>{file.name}</span>
              <span {...api.getItemSizeTextProps({ file })}>
                {api.getFileSize(file)}
              </span>
              <button
                {...api.getItemDeleteTriggerProps({ file })}
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 3.5l7 7M10.5 3.5l-7 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
