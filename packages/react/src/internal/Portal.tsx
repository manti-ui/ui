import { useSyncExternalStore } from 'react';
import { Portal as ZagPortal } from '@zag-js/react';
import type { ComponentProps } from 'react';

export type PortalProps = ComponentProps<typeof ZagPortal>;

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
 */
export function Portal(props: PortalProps) {
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!hydrated) return null;
  return <ZagPortal {...props} />;
}
