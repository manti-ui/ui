/**
 * Internal helpers shared by floating/overlay adapters (dialog, popover,
 * hover card, menu). Not part of the public API.
 */
import { cloneElement, isValidElement, useLayoutEffect } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { mergeProps } from '@zag-js/react';

/**
 * Placement of a floating surface relative to its trigger. Mirrors the Zag.js
 * popper placements so adapters can expose a flat `placement` prop instead of a
 * positioning object.
 */
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

/**
 * A rect to place a floating surface at instead of its trigger, in viewport
 * coordinates. Forwarded to the machine as `positioning.getAnchorRect`.
 */
export type GetAnchorRect = () => {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

/**
 * Remember the element that had focus when a floating surface opened, so a
 * trigger-less surface can hand focus back to it on close. Read in a layout
 * effect: the machines move focus into the panel a frame later, so the panel
 * itself is never what gets recorded.
 */
export function useFocusOrigin(
  origin: RefObject<HTMLElement | null>,
  open: boolean,
): void {
  useLayoutEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    origin.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }, [origin, open]);
}

/**
 * Attach machine trigger props to a user-provided trigger element by cloning it,
 * so consumers can pass any interactive element (e.g. `<Button>`). Event
 * handlers are chained via Zag's `mergeProps`. Non-elements are returned as-is.
 */
export function renderTrigger(
  trigger: ReactNode,
  triggerProps: Record<string, unknown>,
): ReactNode {
  if (!isValidElement(trigger)) return trigger;
  const element = trigger as ReactElement<Record<string, unknown>>;
  return cloneElement(element, mergeProps(element.props, triggerProps));
}
