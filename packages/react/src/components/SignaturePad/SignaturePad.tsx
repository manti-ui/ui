import { useId } from 'react';
import type { ReactNode } from 'react';
import { signaturePad } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface SignaturePadProps {
  /** Optional label. */
  label?: ReactNode;
  /** Clear-button label. */
  clearLabel?: ReactNode;
  /** Accent tone. */
  tone?: MantiTone;
  /** Controlled stroke paths. */
  paths?: string[];
  /** Initial stroke paths for uncontrolled usage. */
  defaultPaths?: string[];
  /** Called when a stroke ends, with all paths. */
  onDrawEnd?: (paths: string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  /** Form field name. */
  name?: string;
  id?: string;
  className?: string;
}

/** A drawable signature surface backed by the Zag.js signature-pad machine. */
export function SignaturePad({
  label,
  clearLabel = 'Clear',
  tone = 'primary',
  paths,
  defaultPaths,
  onDrawEnd,
  disabled,
  readOnly,
  name,
  id,
  className,
}: SignaturePadProps) {
  const autoId = useId();
  const service = useMachine(signaturePad.machine, {
    id: id ?? autoId,
    paths,
    defaultPaths,
    disabled,
    readOnly,
    name,
    onDrawEnd: onDrawEnd ? (details) => onDrawEnd(details.paths) : undefined,
  });
  const api = signaturePad.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()} data-tone={tone} className={cx(className)}>
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <svg {...api.getSegmentProps()}>
          {api.paths.map((path, index) => (
            <path key={index} {...api.getSegmentPathProps({ path })} />
          ))}
          {api.currentPath != null && (
            <path {...api.getSegmentPathProps({ path: api.currentPath })} />
          )}
        </svg>
        <div {...api.getGuideProps()} />
        <button {...api.getClearTriggerProps()}>{clearLabel}</button>
      </div>
    </div>
  );
}
