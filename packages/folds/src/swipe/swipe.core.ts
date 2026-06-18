import type {
  SwipeAxis,
  SwipeDirection,
  SwipeOptions,
  SwipeVector,
} from './swipe.types';

const DEFAULTS = {
  axis: 'both' as SwipeAxis,
  threshold: 48,
  velocityThreshold: 0.5,
  disabled: false,
};

const allowsX = (axis: SwipeAxis) => axis === 'horizontal' || axis === 'both';
const allowsY = (axis: SwipeAxis) => axis === 'vertical' || axis === 'both';

/**
 * The `touch-action` value that lets the browser keep handling scroll on the
 * free axis while the gesture owns the swipe axis. Apply it to the swipe root.
 */
export function touchActionFor(axis: SwipeAxis): string {
  if (axis === 'horizontal') return 'pan-y';
  if (axis === 'vertical') return 'pan-x';
  return 'none';
}

/** A bound swipe controller. Drive it from a renderer's pointer handler. */
export interface SwipeControl {
  /** Begin tracking a gesture. Wire to the root's `pointerdown`. */
  pointerDown(event: PointerEvent): void;
  /** Replace the live options (config + callbacks) without losing an in-flight drag. */
  update(options: SwipeOptions): void;
  /** The current `touch-action` for the root, derived from the axis. */
  touchAction(): string;
  /** Detach any in-flight window listeners. Idempotent; safe to call on unmount. */
  destroy(): void;
}

/**
 * Create a framework-agnostic swipe controller. It owns only gesture math and
 * pointer bookkeeping — it never touches layout or styles, so a renderer is free
 * to translate the element, dismiss it, or ignore the motion entirely.
 *
 * Window-level move/up listeners are attached for the duration of a drag so the
 * gesture survives the pointer leaving the element.
 */
export function createSwipe(initial: SwipeOptions = {}): SwipeControl {
  // A single mutable options object the listeners read at call time, so
  // `update()` mid-drag is observed without re-binding listeners.
  let opts = { ...DEFAULTS, ...initial };

  let active = false;
  let pointerId = -1;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let velX = 0;
  let velY = 0;
  let view: (Window & typeof globalThis) | null = null;

  const axisOffset = (dx: number, dy: number): SwipeVector => ({
    x: allowsX(opts.axis) ? dx : 0,
    y: allowsY(opts.axis) ? dy : 0,
  });

  const onMove = (event: PointerEvent) => {
    if (!active || event.pointerId !== pointerId) return;
    const dt = event.timeStamp - lastT || 16;
    velX = (event.clientX - lastX) / dt;
    velY = (event.clientY - lastY) / dt;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = event.timeStamp;
    opts.onSwipeMove?.(axisOffset(event.clientX - startX, event.clientY - startY));
  };

  const onUp = (event: PointerEvent) => {
    if (!active || event.pointerId !== pointerId) return;
    const offset = axisOffset(event.clientX - startX, event.clientY - startY);
    const vx = allowsX(opts.axis) ? velX : 0;
    const vy = allowsY(opts.axis) ? velY : 0;

    // Whichever axis moved more decides the reported direction.
    const horizontal = Math.abs(offset.x) >= Math.abs(offset.y);
    const distance = horizontal ? offset.x : offset.y;
    const velocity = horizontal ? vx : vy;
    const swiped =
      (Math.abs(distance) >= opts.threshold ||
        Math.abs(velocity) >= opts.velocityThreshold) &&
      (distance !== 0 || velocity !== 0);

    if (swiped) {
      const sign = distance !== 0 ? distance : velocity;
      const direction: SwipeDirection = horizontal
        ? sign < 0
          ? 'left'
          : 'right'
        : sign < 0
          ? 'up'
          : 'down';
      opts.onSwipe?.({ direction, offset, velocity: { x: vx, y: vy } });
    }

    cleanup();
    opts.onSwipeEnd?.({ swiped });
  };

  const cleanup = () => {
    if (view) {
      view.removeEventListener('pointermove', onMove);
      view.removeEventListener('pointerup', onUp);
      view.removeEventListener('pointercancel', onUp);
    }
    active = false;
    pointerId = -1;
    view = null;
  };

  const pointerDown = (event: PointerEvent) => {
    if (opts.disabled || active) return;
    // Primary button / primary touch only.
    if (event.button != null && event.button !== 0) return;

    active = true;
    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    startY = lastY = event.clientY;
    lastT = event.timeStamp;
    velX = velY = 0;

    const target = event.target as Element | null;
    view = target?.ownerDocument?.defaultView ?? globalThis.window ?? null;
    // No view (non-DOM environment) means nothing to track.
    if (!view) {
      active = false;
      return;
    }
    view.addEventListener('pointermove', onMove);
    view.addEventListener('pointerup', onUp);
    view.addEventListener('pointercancel', onUp);
    opts.onSwipeStart?.();
  };

  return {
    pointerDown,
    update: (next) => {
      opts = { ...DEFAULTS, ...next };
    },
    touchAction: () => touchActionFor(opts.axis),
    destroy: cleanup,
  };
}
