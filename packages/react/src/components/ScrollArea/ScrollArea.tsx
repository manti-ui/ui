import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type {
  ComponentPropsWithoutRef,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';

import { cx, dataBool } from '../../internal/props';

const MIN_THUMB = 24;
/** How long the scrollbar lingers after the last activity, in `type="auto"`. */
const IDLE_MS = 1100;

type Axis = 'v' | 'h';

interface Metrics {
  /** Thumb length in px along the scroll axis. */
  size: number;
  /** Thumb offset in px from the track start. */
  offset: number;
  /** Whether the content overflows on this axis. */
  show: boolean;
}

const HIDDEN: Metrics = { size: 0, offset: 0, show: false };

const same = (a: Metrics, b: Metrics) =>
  a.show === b.show &&
  Math.round(a.size) === Math.round(b.size) &&
  Math.round(a.offset) === Math.round(b.offset);

export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
  /** The content to scroll. */
  children: ReactNode;
  /**
   * Which axis scrolls. `vertical` and `horizontal` constrain the cross axis;
   * `both` scrolls in either direction.
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * When the scrollbars are shown:
   * - `auto` (default) — while the pointer moves over the area or it scrolls,
   *   then hidden after a short idle pause or when the pointer leaves.
   * - `hover` — while hovering, focused within, or dragging.
   * - `always` — whenever the content overflows.
   */
  type?: 'auto' | 'hover' | 'always';
  /**
   * Make the viewport focusable so it can be scrolled by keyboard when it holds
   * no naturally focusable content. @default true
   */
  focusable?: boolean;
}

/**
 * A scrollable viewport with a custom, grabbable scrollbar. Manti UI has no Zag
 * machine for this — it is a static component that hides the native scrollbar
 * and renders its own track + thumb, sized from the viewport's scroll metrics,
 * so the thumb can be dragged. By default (`type="auto"`) the thumb appears on
 * pointer movement or scrolling and fades out once the pointer goes idle or
 * leaves.
 *
 * Give the root a bounded size (a `height`/`max-height` for vertical scrolling,
 * a `width`/`max-width` for horizontal) — the viewport scrolls within it.
 */
export function ScrollArea({
  children,
  orientation = 'vertical',
  type = 'auto',
  focusable = true,
  className,
  ...rest
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const vTrackRef = useRef<HTMLDivElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const vMetrics = useRef<Metrics>(HIDDEN);
  const hMetrics = useRef<Metrics>(HIDDEN);
  const frame = useRef(0);
  const draggingRef = useRef<Axis | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [v, setV] = useState<Metrics>(HIDDEN);
  const [h, setH] = useState<Metrics>(HIDDEN);
  const [dragging, setDragging] = useState<Axis | null>(null);
  const [active, setActive] = useState(false);

  const allowV = orientation === 'vertical' || orientation === 'both';
  const allowH = orientation === 'horizontal' || orientation === 'both';

  const recompute = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    let nextV = HIDDEN;
    if (allowV && vp.scrollHeight - vp.clientHeight > 1) {
      const trackLen = vTrackRef.current?.clientHeight ?? vp.clientHeight;
      const size = Math.max(MIN_THUMB, (vp.clientHeight / vp.scrollHeight) * trackLen);
      const maxScroll = vp.scrollHeight - vp.clientHeight;
      const offset = maxScroll > 0 ? (vp.scrollTop / maxScroll) * (trackLen - size) : 0;
      nextV = { size, offset, show: true };
    }

    let nextH = HIDDEN;
    if (allowH && vp.scrollWidth - vp.clientWidth > 1) {
      const trackLen = hTrackRef.current?.clientWidth ?? vp.clientWidth;
      const size = Math.max(MIN_THUMB, (vp.clientWidth / vp.scrollWidth) * trackLen);
      const maxScroll = vp.scrollWidth - vp.clientWidth;
      const offset = maxScroll > 0 ? (vp.scrollLeft / maxScroll) * (trackLen - size) : 0;
      nextH = { size, offset, show: true };
    }

    if (!same(vMetrics.current, nextV)) {
      vMetrics.current = nextV;
      setV(nextV);
    }
    if (!same(hMetrics.current, nextH)) {
      hMetrics.current = nextH;
      setH(nextH);
    }
  }, [allowV, allowH]);

  const schedule = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      recompute();
    });
  }, [recompute]);

  // `auto` visibility: wake on activity, then arm an idle timer to fade out.
  // Never hide mid-drag — the drag-end handler re-arms the timer.
  const wake = useCallback(() => {
    if (type !== 'auto') return;
    setActive(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (!draggingRef.current) setActive(false);
    }, IDLE_MS);
  }, [type]);

  const onRootPointerLeave = () => {
    if (type !== 'auto' || draggingRef.current) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setActive(false);
  };

  useLayoutEffect(() => {
    recompute();
  }, [recompute, children, orientation]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onScroll = () => {
      schedule();
      wake();
    };
    vp.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);

    const ro = new ResizeObserver(schedule);
    ro.observe(vp);
    if (vp.firstElementChild) ro.observe(vp.firstElementChild);
    if (vTrackRef.current) ro.observe(vTrackRef.current);
    if (hTrackRef.current) ro.observe(hTrackRef.current);

    return () => {
      vp.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [schedule, wake]);

  // Drag the thumb: translate pointer movement into proportional scrolling.
  const onThumbPointerDown = (axis: Axis) => (event: ReactPointerEvent) => {
    const vp = viewportRef.current;
    if (!vp || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const thumb = event.currentTarget as HTMLElement;
    thumb.setPointerCapture(event.pointerId);
    draggingRef.current = axis;
    setDragging(axis);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setActive(true);

    const isV = axis === 'v';
    const startPointer = isV ? event.clientY : event.clientX;
    const startScroll = isV ? vp.scrollTop : vp.scrollLeft;
    const trackLen = isV
      ? (vTrackRef.current?.clientHeight ?? 0)
      : (hTrackRef.current?.clientWidth ?? 0);
    const thumbSize = (isV ? vMetrics.current : hMetrics.current).size;
    const maxScroll = isV
      ? vp.scrollHeight - vp.clientHeight
      : vp.scrollWidth - vp.clientWidth;
    const maxThumb = trackLen - thumbSize;

    const onMove = (e: PointerEvent) => {
      const delta = (isV ? e.clientY : e.clientX) - startPointer;
      const next = maxThumb > 0 ? startScroll + (delta / maxThumb) * maxScroll : startScroll;
      if (isV) vp.scrollTop = next;
      else vp.scrollLeft = next;
    };
    const onUp = () => {
      thumb.releasePointerCapture?.(event.pointerId);
      thumb.removeEventListener('pointermove', onMove);
      thumb.removeEventListener('pointerup', onUp);
      thumb.removeEventListener('pointercancel', onUp);
      draggingRef.current = null;
      setDragging(null);
      wake();
    };
    thumb.addEventListener('pointermove', onMove);
    thumb.addEventListener('pointerup', onUp);
    thumb.addEventListener('pointercancel', onUp);
  };

  // Click the empty track: jump so the thumb centers under the pointer.
  const onTrackPointerDown = (axis: Axis) => (event: ReactPointerEvent) => {
    if (event.target !== event.currentTarget) return; // ignore clicks on the thumb
    const vp = viewportRef.current;
    if (!vp) return;

    const isV = axis === 'v';
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = isV ? event.clientY - rect.top : event.clientX - rect.left;
    const trackLen = isV ? rect.height : rect.width;
    const thumbSize = (isV ? vMetrics.current : hMetrics.current).size;
    const maxThumb = trackLen - thumbSize;
    const ratio =
      maxThumb > 0 ? Math.min(1, Math.max(0, (pos - thumbSize / 2) / maxThumb)) : 0;
    const maxScroll = isV
      ? vp.scrollHeight - vp.clientHeight
      : vp.scrollWidth - vp.clientWidth;

    if (isV) vp.scrollTo({ top: ratio * maxScroll, behavior: 'smooth' });
    else vp.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' });
  };

  return (
    <div
      {...rest}
      data-scope="scroll-area"
      data-part="root"
      data-orientation={orientation}
      data-type={type}
      data-active={dataBool(active)}
      data-dragging={dataBool(dragging != null)}
      className={cx(className)}
      onPointerMove={wake}
      onPointerLeave={onRootPointerLeave}
    >
      <div
        ref={viewportRef}
        data-scope="scroll-area"
        data-part="viewport"
        tabIndex={focusable ? 0 : undefined}
        role={focusable ? 'group' : undefined}
      >
        <div data-scope="scroll-area" data-part="content">
          {children}
        </div>
      </div>

      {allowV && (
        <div
          ref={vTrackRef}
          data-scope="scroll-area"
          data-part="scrollbar"
          data-orientation="vertical"
          data-state={v.show ? 'visible' : 'hidden'}
          style={{ insetBlockEnd: h.show ? 'var(--manti-scroll-area-size)' : 0 }}
          onPointerDown={onTrackPointerDown('v')}
        >
          <div
            data-scope="scroll-area"
            data-part="thumb"
            style={{ height: v.size, transform: `translateY(${v.offset}px)` }}
            onPointerDown={onThumbPointerDown('v')}
          />
        </div>
      )}

      {allowH && (
        <div
          ref={hTrackRef}
          data-scope="scroll-area"
          data-part="scrollbar"
          data-orientation="horizontal"
          data-state={h.show ? 'visible' : 'hidden'}
          style={{ insetInlineEnd: v.show ? 'var(--manti-scroll-area-size)' : 0 }}
          onPointerDown={onTrackPointerDown('h')}
        >
          <div
            data-scope="scroll-area"
            data-part="thumb"
            style={{ width: h.size, transform: `translateX(${h.offset}px)` }}
            onPointerDown={onThumbPointerDown('h')}
          />
        </div>
      )}
    </div>
  );
}
