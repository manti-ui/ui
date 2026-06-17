import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from 'react';

import { cx } from '../../internal/props';

export interface MarqueeProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** Content to scroll. It is duplicated to make the loop seamless. */
  children: ReactNode;
  /** Scroll direction. Vertical (`up`/`down`) needs the root to have a height. */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** Seconds for one full loop. Higher is slower. */
  speed?: number;
  /** Pause the scroll while the pointer is over it. */
  pauseOnHover?: boolean;
  /** Spacing between the repeated content. */
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * A continuously scrolling strip of content (a "marquee"). Manti UI has no Zag
 * machine for this — it is a static, CSS-animation component. The content is
 * duplicated for a seamless loop and the copy is hidden from assistive tech.
 * Respects reduced motion and `data-motion="none"` (the strip then holds still).
 */
export function Marquee({
  children,
  direction = 'left',
  speed = 20,
  pauseOnHover = true,
  gap = 'md',
  className,
  style,
  ...rest
}: MarqueeProps) {
  const orientation =
    direction === 'up' || direction === 'down' ? 'vertical' : 'horizontal';

  return (
    <div
      data-scope="marquee"
      data-part="root"
      data-orientation={orientation}
      data-direction={direction}
      data-gap={gap}
      data-pause-on-hover={pauseOnHover || undefined}
      className={cx(className)}
      style={{ '--_duration': `${speed}s`, ...style } as CSSProperties}
      {...rest}
    >
      <div data-scope="marquee" data-part="content">
        <div data-scope="marquee" data-part="group">
          {children}
        </div>
        <div data-scope="marquee" data-part="group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
