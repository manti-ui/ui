import { useId } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { toast } from '@manti-ui/folds';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { CloseIcon } from '../../internal/icons';

/** Where the toast stack sits in the viewport. */
export type ToastPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end';

export interface CreateToasterOptions {
  /** Corner the stack is anchored to. @default 'bottom-end' */
  placement?: ToastPlacement;
  /** Stack toasts on top of each other until hovered. @default true */
  overlap?: boolean;
  /** Maximum simultaneously visible toasts; extras queue. */
  max?: number;
  /** Gap between toasts, in px. */
  gap?: number;
  /** Default visible duration, in ms. */
  duration?: number;
}

/** The imperative toast store returned by {@link createToaster}. */
export type MantiToaster = toast.Store<ReactNode>;

export interface ToasterProps {
  className?: string;
}

export interface ToasterInstance {
  /** Imperative API — `toaster.create(...)`, `.success(...)`, `.dismiss(...)`. */
  toaster: MantiToaster;
  /** Render once near the app root to host the toast region. */
  Toaster: (props?: ToasterProps) => ReactElement;
}

interface ToastItemProps {
  toast: toast.Props;
  index: number;
  parent: toast.GroupService;
}

function ToastItem({ toast: data, index, parent }: ToastItemProps) {
  const service = useMachine(toast.machine, { ...data, index, parent });
  const api = toast.connect(service, normalizeProps);

  return (
    <div {...api.getRootProps()}>
      <span {...api.getGhostBeforeProps()} />
      {api.title != null && <div {...api.getTitleProps()}>{api.title}</div>}
      {api.description != null && (
        <div {...api.getDescriptionProps()}>{api.description}</div>
      )}
      {api.closable && (
        <button {...api.getCloseTriggerProps()}>
          <CloseIcon />
        </button>
      )}
      <span {...api.getGhostAfterProps()} />
    </div>
  );
}

/**
 * Create an isolated toast store plus its `Toaster` host component, both backed
 * by the Zag.js toast machines. The store owns queueing, timers, and pausing;
 * the host renders the frosted toast anatomy through a portal.
 *
 * ```tsx
 * const { toaster, Toaster } = createToaster();
 * // near the app root:  <Toaster />
 * // anywhere:           toaster.success({ title: 'Saved' });
 * ```
 */
export function createToaster(
  options: CreateToasterOptions = {},
): ToasterInstance {
  const store = toast.createStore<ReactNode>({
    placement: 'bottom-end',
    overlap: true,
    ...options,
  });

  function Toaster({ className }: ToasterProps = {}) {
    const id = useId();
    const service = useMachine(toast.group.machine, { id, store });
    const api = toast.group.connect(service, normalizeProps);

    return (
      <Portal>
        <div {...api.getGroupProps()} className={cx(className)}>
          {api.getToasts().map((item, index) => (
            <ToastItem
              key={item.id}
              toast={item}
              index={index}
              parent={service}
            />
          ))}
        </div>
      </Portal>
    );
  }

  return { toaster: store, Toaster };
}
