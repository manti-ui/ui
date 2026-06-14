/**
 * Internal helpers shared by floating/overlay adapters (dialog, popover,
 * hover card, menu). Not part of the public API.
 */
import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
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
