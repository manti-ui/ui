import { createContext, useContext, useSyncExternalStore } from 'react';
import { Portal as ZagPortal } from '@zag-js/react';
import type { ComponentProps, ReactNode, RefObject } from 'react';

export type PortalProps = ComponentProps<typeof ZagPortal>;

const PortalContainerContext = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

export interface PortalContainerProviderProps {
  /**
   * The element every Manti overlay rendered below this provider portals
   * into, instead of `document.body`. Point it at the app's own top-layer
   * element (a native `<dialog>` opened with `showModal()`, or a `popover`
   * element) so menus, popovers and pickers opened inside it paint above it
   * and take input. The element must be mounted before an overlay opens;
   * while `current` is `null` the overlay falls back to `document.body`.
   */
  container: RefObject<HTMLElement | null>;
  children?: ReactNode;
}

/**
 * Makes every Manti overlay below it (Menu, Select, Combobox, Popover,
 * HoverCard, Dialog, Drawer, the pickers, FloatingPanel, Tour, Toast) mount
 * inside `container` rather than on `document.body`. An overlay's own explicit
 * container, such as Tooltip's `portalContainer`, still wins.
 */
export function PortalContainerProvider({
  container,
  children,
}: PortalContainerProviderProps) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  );
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * SSR-safe replacement for Zag's `Portal`.
 *
 * Zag's version branches on `typeof window`: on the server it renders the
 * children *inline*, and in the browser it renders them through `createPortal`.
 * The two trees are not the same shape, so a server-rendered page hydrates into
 * a different tree than it shipped — the inline markup is discarded and every
 * `useId` after it shifts, leaving stale `id` / `aria-labelledby` pairs that
 * React explicitly does not patch up.
 *
 * Gating on hydration makes both passes agree: the server and the first client
 * render (the hydration render) both produce nothing, and the portal appears in
 * the commit right after. Nothing is lost by it — portals only ever carry
 * overlay content (dialogs, popovers, pickers, toasts), which is closed at rest
 * and has no standalone value in prerendered HTML.
 *
 * The gate is a `useSyncExternalStore` snapshot rather than `useState` +
 * `useEffect`, because most callers render this as `{api.open && <Portal>…}`:
 * a per-instance mount flag resets on every open, so the first render after
 * opening would emit nothing and the machine would find no positioner element
 * to attach floating-ui to — leaving the panel stuck, unpositioned, at the
 * top-left of the viewport. The store snapshot is only `false` while React is
 * hydrating; a portal mounted after that reads `true` on its very first render.
 *
 * The mount node is the `container` prop, else the nearest
 * `PortalContainerProvider`'s element, else `document.body`.
 */
export function Portal(props: PortalProps) {
  const contextContainer = useContext(PortalContainerContext);
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!hydrated) return null;
  return (
    <ZagPortal
      {...props}
      container={
        props.container ??
        (contextContainer as RefObject<HTMLElement> | undefined)
      }
    />
  );
}
