---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
---

Add `--manti-font-display`, the face of `Heading` and every component title part (Card, Dialog, Drawer, Popover, Alert, Toast, Tour, FloatingPanel, DataTable, and the Steps item title). It is the new `display` key of `fontFamily` in `@manti-ui/tokens` and defaults to `var(--manti-font-sans)`, so nothing changes until a theme sets it. The Tailwind theme maps it to `--font-display`.
