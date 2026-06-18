import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { swipe } from '@manti-ui/folds';

import { cx, dataBool } from '../../internal/props';

export type SwipeAxis = swipe.SwipeAxis;
export type SwipeDirection = swipe.SwipeDirection;
export type SwipeDetails = swipe.SwipeDetails;
export type SwipeVector = swipe.SwipeVector;

export interface SwipeProps {
  /** Content made swipeable. */
  children?: ReactNode;
  /** Axis the gesture may travel along. @default 'both' */
  axis?: SwipeAxis;
  /** Distance in pixels the pointer must travel to recognize a swipe. @default 48 */
  threshold?: number;
  /** Flick velocity (px/ms) that recognizes a swipe regardless of distance. @default 0.5 */
  velocityThreshold?: number;
  /**
   * Translate the content to follow the pointer during a drag, then spring back
   * to origin on release. Turn off for a pure gesture detector. @default true
   */
  followPointer?: boolean;
  /** Disable the gesture. @default false */
  disabled?: boolean;
  /** Fired when a drag is released past the distance or velocity threshold. */
  onSwipe?: (details: SwipeDetails) => void;
  /** Fired when a gesture begins. */
  onSwipeStart?: () => void;
  /** Fired on every move with the current axis-constrained offset. */
  onSwipeMove?: (offset: SwipeVector) => void;
  /** Fired when a gesture ends; `swiped` is true when {@link SwipeProps.onSwipe} fired. */
  onSwipeEnd?: (details: { swiped: boolean }) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Make any content swipeable, horizontally and/or vertically. Backed by the
 * framework-agnostic swipe core in `@manti-ui/folds` (not a Zag.js machine).
 *
 * By default the content follows the pointer and springs back on release while
 * `onSwipe` reports the recognized direction — build swipe-to-dismiss, cards, or
 * a plain gesture detector on top.
 */
export function Swipe({
  children,
  axis = 'both',
  threshold = 48,
  velocityThreshold = 0.5,
  followPointer = true,
  disabled = false,
  onSwipe,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
  className,
  style,
}: SwipeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const control = useMemo(() => swipe.createSwipe(), []);

  // Refresh config + callbacks every render so the controller's listeners read
  // the latest closures (they reference the live options object by reference).
  useEffect(() => {
    control.update({
      axis,
      threshold,
      velocityThreshold,
      disabled,
      onSwipeStart: () => {
        setDragging(true);
        onSwipeStart?.();
      },
      onSwipeMove: (offset) => {
        if (followPointer && ref.current) {
          ref.current.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
        }
        onSwipeMove?.(offset);
      },
      onSwipe,
      onSwipeEnd: (details) => {
        setDragging(false);
        onSwipeEnd?.(details);
      },
    });
  });

  // Clear the imperative transform only after `data-dragging` is gone, so the
  // reset animates back via the CSS transition instead of snapping.
  useEffect(() => {
    if (!dragging && followPointer && ref.current) {
      ref.current.style.transform = '';
    }
  }, [dragging, followPointer]);

  useEffect(() => () => control.destroy(), [control]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    control.pointerDown(event.nativeEvent);
  };

  return (
    <div
      ref={ref}
      data-scope="swipe"
      data-part="root"
      data-axis={axis}
      data-dragging={dataBool(dragging)}
      data-disabled={dataBool(disabled)}
      onPointerDown={onPointerDown}
      style={{
        touchAction: disabled ? undefined : swipe.touchActionFor(axis),
        ...style,
      }}
      className={cx(className)}
    >
      {children}
    </div>
  );
}
