---
'@manti-ui/react': patch
---

`PortalContainerProvider` lets an app say where Manti overlays mount. Every overlay rendered below it (Menu, Select, Combobox, Popover, HoverCard, Dialog, Drawer, the pickers, FloatingPanel, Tour, Toast) portals into the provider's `container` instead of `document.body`, so an overlay opened inside the app's own `showModal()` dialog or `popover` element paints above it and takes input. An overlay's explicit container, such as Tooltip's `portalContainer`, still wins, and with no provider nothing changes.
