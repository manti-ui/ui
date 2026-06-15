import { useId } from 'react';
import type { ReactNode } from 'react';
import { avatar } from '@manti-ui/folds';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface AvatarProps {
  /** Image source. Falls back to initials/children when it fails to load. */
  src?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Fallback content — typically initials. */
  children?: ReactNode;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Shape. */
  shape?: 'circle' | 'square';
  id?: string;
  className?: string;
}

/** An avatar with graceful image-load fallback, backed by the Zag.js avatar
 * machine. */
export function Avatar({
  src,
  alt = '',
  children,
  size = 'md',
  shape = 'circle',
  id,
  className,
}: AvatarProps) {
  const autoId = useId();
  const service = useMachine(avatar.machine, { id: id ?? autoId });
  const api = avatar.connect(service, normalizeProps);

  return (
    <span
      {...api.getRootProps()}
      data-size={size}
      data-shape={shape}
      className={cx(className)}
    >
      <span {...api.getFallbackProps()}>{children}</span>
      {src != null && <img {...api.getImageProps()} src={src} alt={alt} />}
    </span>
  );
}
