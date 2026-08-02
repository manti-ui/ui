import { forwardRef } from 'react';
import type { BlockquoteHTMLAttributes } from 'react';

import { cx } from '../../internal/props';

export type BlockquoteSize = 'md' | 'lg';

export interface BlockquoteProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  /** Visual size of the quoted text. */
  size?: BlockquoteSize;
}

/** A semantic block quotation with a quiet Manti accent. */
export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  function Blockquote({ size = 'md', className, ...rest }, ref) {
    return (
      <blockquote
        {...rest}
        ref={ref}
        data-scope="blockquote"
        data-part="root"
        data-size={size}
        className={cx(className)}
      />
    );
  },
);
