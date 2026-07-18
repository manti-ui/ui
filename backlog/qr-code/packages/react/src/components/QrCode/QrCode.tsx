import { useId } from 'react';
import type { ReactNode } from 'react';
import { qrCode } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface QrCodeProps {
  /** The encoded value. */
  value: string;
  /** Control size in pixels. */
  size?: number;
  /** Optional overlay (e.g. a logo) centered on the code. */
  overlay?: ReactNode;
  id?: string;
  className?: string;
}

/** A QR code backed by the Zag.js qr-code machine. */
export function QrCode({
  value,
  size = 160,
  overlay,
  id,
  className,
}: QrCodeProps) {
  const autoId = useId();
  const service = useMachine(qrCode.machine, { id: id ?? autoId, value });
  const api = qrCode.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      style={{ width: size, height: size }}
      className={cx(className)}
    >
      <svg {...api.getFrameProps()}>
        <path {...api.getPatternProps()} />
      </svg>
      {overlay != null && <div {...api.getOverlayProps()}>{overlay}</div>}
    </div>
  );
}
