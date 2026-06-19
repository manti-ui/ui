import { useEffect, useId, useMemo, useRef } from 'react';
import type {
  PointerEvent as ReactPointerEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { swipe as swipeBehavior, toast } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, Portal, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';
import { CloseIcon } from '../../internal/icons';
import { Spinner } from '../Spinner/Spinner';

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
  /**
   * Allow dismissing a toast by swiping it toward the edge it is anchored to
   * (a right-anchored toast swipes right, `top` swipes up, …). Powered by the
   * `@manti-ui/folds` swipe core. @default true
   */
  swipe?: boolean;
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

/** Map a toast type to the semantic tone that colors it. */
const TONE_BY_TYPE: Record<string, MantiTone> = {
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'info',
  loading: 'neutral',
};

const toneForType = (type: string): MantiTone => TONE_BY_TYPE[type] ?? 'neutral';

const iconBase = {
  width: 18,
  height: 18,
  viewBox: '0 0 18 18',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const ICON_BY_TYPE: Record<string, ReactNode> = {
  success: (
    <svg {...iconBase}>
      <circle cx="9" cy="9" r="6.75" />
      <path d="M6 9.2 8 11.2 12 6.8" />
    </svg>
  ),
  error: (
    <svg {...iconBase}>
      <circle cx="9" cy="9" r="6.75" />
      <path d="M9 5.5v4" />
      <path d="M9 12h.01" />
    </svg>
  ),
  warning: (
    <svg {...iconBase}>
      <path d="M9 2.6 1.8 15h14.4L9 2.6Z" />
      <path d="M9 7v3.4" />
      <path d="M9 12.6h.01" />
    </svg>
  ),
  info: (
    <svg {...iconBase}>
      <circle cx="9" cy="9" r="6.75" />
      <path d="M9 8.5v4" />
      <path d="M9 6h.01" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg {...iconBase} fill="currentColor" stroke="none">
    <circle cx="9" cy="9" r="3.2" />
  </svg>
);

function iconForType(type: string): ReactNode {
  if (type === 'loading') return <Spinner size="sm" aria-hidden />;
  return ICON_BY_TYPE[type] ?? DEFAULT_ICON;
}

type DismissDirection = {
  axis: swipeBehavior.SwipeAxis;
  sign: 1 | -1;
  toward: swipeBehavior.SwipeDirection;
};

/** The single direction a toast may be flung to dismiss, from its placement. */
function dismissDirection(placement: string): DismissDirection {
  if (placement.endsWith('-end'))
    return { axis: 'horizontal', sign: 1, toward: 'right' };
  if (placement.endsWith('-start'))
    return { axis: 'horizontal', sign: -1, toward: 'left' };
  if (placement === 'top') return { axis: 'vertical', sign: -1, toward: 'up' };
  return { axis: 'vertical', sign: 1, toward: 'down' };
}

interface ToastItemProps {
  toast: toast.Props;
  index: number;
  parent: toast.GroupService;
  swipe: boolean;
}

function ToastItem({
  toast: data,
  index,
  parent,
  swipe: swipeEnabled,
}: ToastItemProps) {
  const service = useMachine(toast.machine, { ...data, index, parent });
  const api = toast.connect(service, normalizeProps);
  const rootProps = api.getRootProps();

  const type = api.type ?? '';
  const dir = useMemo(
    () => dismissDirection(api.placement),
    [api.placement],
  );

  // The element under the active gesture, captured at pointer-down so the swipe
  // callbacks can mutate it without attaching a ref to Zag's root.
  const elRef = useRef<HTMLElement | null>(null);
  const control = useMemo(() => swipeBehavior.createSwipe(), []);

  useEffect(() => {
    if (!swipeEnabled) {
      control.update({ disabled: true });
      return;
    }
    control.update({
      axis: dir.axis,
      onSwipeStart: () => {
        if (elRef.current) elRef.current.dataset.swiping = '';
      },
      onSwipeMove: (offset) => {
        const el = elRef.current;
        if (!el) return;
        // Follow the pointer only toward the dismiss edge; resist the other way.
        const raw = dir.axis === 'vertical' ? offset.y : offset.x;
        const moved = dir.sign > 0 ? Math.max(0, raw) : Math.min(0, raw);
        el.style.transform =
          dir.axis === 'vertical'
            ? `translateY(${moved}px)`
            : `translateX(${moved}px)`;
        el.style.opacity = String(Math.max(0.2, 1 - Math.abs(moved) / 240));
      },
      onSwipe: (details) => {
        if (details.direction === dir.toward) api.dismiss();
      },
      onSwipeEnd: () => {
        const el = elRef.current;
        if (!el) return;
        delete el.dataset.swiping;
        el.style.transform = '';
        el.style.opacity = '';
      },
    });
  }, [swipeEnabled, dir, api, control]);

  useEffect(() => () => control.destroy(), [control]);

  return (
    <div
      {...rootProps}
      data-tone={toneForType(type)}
      data-swipe={swipeEnabled ? '' : undefined}
      onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
        rootProps.onPointerDown?.(event);
        if (!swipeEnabled) return;
        elRef.current = event.currentTarget;
        control.pointerDown(event.nativeEvent);
      }}
      style={{
        ...rootProps.style,
        ...(swipeEnabled
          ? { touchAction: swipeBehavior.touchActionFor(dir.axis) }
          : {}),
      }}
    >
      <span {...api.getGhostBeforeProps()} />
      <span data-scope="toast" data-part="indicator" aria-hidden="true">
        {iconForType(type)}
      </span>
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
 * the host renders the frosted, tone-colored toast anatomy through a portal.
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
  const { swipe: swipeEnabled = true, ...storeOptions } = options;
  const store = toast.createStore<ReactNode>({
    placement: 'bottom-end',
    overlap: true,
    ...storeOptions,
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
              swipe={swipeEnabled}
            />
          ))}
        </div>
      </Portal>
    );
  }

  return { toaster: store, Toaster };
}
