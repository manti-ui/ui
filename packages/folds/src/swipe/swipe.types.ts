/**
 * Swipe — a Manti-original, framework-agnostic gesture primitive. Unlike the
 * rest of `@manti-ui/folds`, it is not backed by a Zag.js machine (Zag has no
 * swipe component); it is plain DOM + TypeScript so any renderer can consume it.
 */

/** Axes a swipe is allowed to travel along. */
export type SwipeAxis = 'horizontal' | 'vertical' | 'both';

/** Resolved swipe direction, reported once a gesture crosses the threshold. */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/** A 2D vector in CSS pixels. */
export interface SwipeVector {
  x: number;
  y: number;
}

/** Payload emitted when a gesture is recognized as a swipe. */
export interface SwipeDetails {
  /** The dominant direction of travel. */
  direction: SwipeDirection;
  /** Total axis-constrained offset, in pixels, at release. */
  offset: SwipeVector;
  /** Pointer velocity at release, in pixels per millisecond. */
  velocity: SwipeVector;
}

/** Lifecycle callbacks fired across a gesture. */
export interface SwipeHandlers {
  /** Pointer pressed and a gesture began tracking. */
  onSwipeStart?: () => void;
  /** Pointer moved; receives the current axis-constrained offset. */
  onSwipeMove?: (offset: SwipeVector) => void;
  /** Released past the distance or velocity threshold. */
  onSwipe?: (details: SwipeDetails) => void;
  /** Gesture finished; `swiped` is true when {@link SwipeHandlers.onSwipe} fired. */
  onSwipeEnd?: (details: { swiped: boolean }) => void;
}

/** Configuration for {@link createSwipe}. */
export interface SwipeOptions extends SwipeHandlers {
  /** Axis the gesture may travel along. @default 'both' */
  axis?: SwipeAxis;
  /** Distance in pixels the pointer must travel to recognize a swipe. @default 48 */
  threshold?: number;
  /** Flick velocity (px/ms) that recognizes a swipe regardless of distance. @default 0.5 */
  velocityThreshold?: number;
  /** When true the gesture is inert. @default false */
  disabled?: boolean;
}
