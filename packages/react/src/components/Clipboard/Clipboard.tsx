import { useId } from 'react';
import type { ReactNode } from 'react';
import { clipboard } from '@manti-ui/folds';
import type { MantiVariant } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { useFocusVisible } from '../../internal/focusVisible';
import { cx } from '../../internal/props';

export interface ClipboardProps {
  /** The value to copy. */
  value: string;
  /** Optional label. */
  label?: ReactNode;
  /** Copied-indicator variant. */
  variant?: MantiVariant;
  /** How long the copied state lasts (ms). */
  timeout?: number;
  id?: string;
  className?: string;
}

export interface UseClipboardOptions {
  value?: string;
  defaultValue?: string;
  timeout?: number;
  onValueChange?: (value: string) => void;
  onStatusChange?: (copied: boolean) => void;
  id?: string;
}

export interface UseClipboardReturn {
  copied: boolean;
  value: string;
  setValue: (value: string) => void;
  copy: () => void;
}

const copyIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <rect
      x="5.5"
      y="5.5"
      width="8"
      height="8"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

const checkIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3.5 8.5l3 3 6-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Headless clipboard state for product-owned buttons and share fallbacks. */
export function useClipboard({
  value,
  defaultValue,
  timeout,
  onValueChange,
  onStatusChange,
  id,
}: UseClipboardOptions): UseClipboardReturn {
  const autoId = useId();
  const service = useMachine(clipboard.machine, {
    id: id ?? autoId,
    value,
    defaultValue,
    timeout,
    onValueChange: onValueChange
      ? (details) => onValueChange(details.value)
      : undefined,
    onStatusChange: onStatusChange
      ? (details) => onStatusChange(details.copied)
      : undefined,
  });
  const api = clipboard.connect(service, normalizeProps);

  return {
    copied: api.copied,
    value: api.value,
    setValue: api.setValue,
    copy: api.copy,
  };
}

/** A copy-to-clipboard field backed by the Zag.js clipboard machine. */
export function Clipboard({
  value,
  label,
  variant = 'primary',
  timeout,
  id,
  className,
}: ClipboardProps) {
  const autoId = useId();
  const service = useMachine(clipboard.machine, {
    id: id ?? autoId,
    value,
    timeout,
  });
  const api = clipboard.connect(service, normalizeProps);
  const focusVisibleProps = useFocusVisible<HTMLDivElement>();
  const triggerFocusVisibleProps = useFocusVisible<HTMLButtonElement>();

  return (
    <div
      {...api.getRootProps()}
      data-variant={variant}
      className={cx(className)}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()} {...focusVisibleProps}>
        <input {...api.getInputProps()} />
        <button
          {...api.getTriggerProps()}
          {...triggerFocusVisibleProps}
          aria-label="Copy"
        >
          <span {...api.getIndicatorProps({ copied: true })}>{checkIcon}</span>
          <span {...api.getIndicatorProps({ copied: false })}>{copyIcon}</span>
        </button>
      </div>
    </div>
  );
}
