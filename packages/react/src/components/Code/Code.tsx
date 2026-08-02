import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

import { cx } from '../../internal/props';

export type CodeSize = 'sm' | 'md';

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** Visual size of the inline code. */
  size?: CodeSize;
}

/** Semantic inline code with a token-backed Manti treatment. */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { size = 'sm', className, ...rest },
  ref,
) {
  return (
    <code
      {...rest}
      ref={ref}
      data-scope="code"
      data-part="root"
      data-size={size}
      className={cx(className)}
    />
  );
});
