---
'@manti-ui/react': patch
---

Fix hydration mismatches in every portal-backed component under SSR/SSG.

Zag's `Portal` branches on `typeof window`: it renders its children inline on
the server and through `createPortal` in the browser. Prerendered pages
therefore hydrated into a differently shaped tree than they shipped — the inline
markup was discarded and every `useId` after it shifted, leaving stale
`id`/`aria-labelledby` pairs that React does not patch up.

Dialog, Drawer, Menu, ContextMenu, Popover, HoverCard, Tooltip, Select,
Combobox, DatePicker, TimePicker, ColorPicker, FloatingPanel, Toast and Tour now
use an internal hydration-gated portal: the server and the first client render
both produce nothing, and the portal mounts in the commit right after. Overlay
content is closed at rest, so nothing is lost from the prerendered HTML.

The gate reads a `useSyncExternalStore` snapshot rather than a per-instance
mount flag. Most of these components render their portal as
`{api.open && <Portal>…}`, so a mount flag reset on every open — the first
render after opening emitted nothing, the machine found no positioner element
to attach floating-ui to, and the panel appeared unpositioned at the top-left of
the viewport. The snapshot is only `false` while React is hydrating, so a portal
mounted after that renders immediately.
