import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

import { cx } from '../../internal/props';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Visual size of the key cap. */
  size?: KbdSize;
}

/** A semantic keyboard-input label styled as a compact key cap. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'sm', className, ...rest },
  ref,
) {
  return (
    <kbd
      {...rest}
      ref={ref}
      data-scope="kbd"
      data-part="root"
      data-size={size}
      className={cx(className)}
    />
  );
});
