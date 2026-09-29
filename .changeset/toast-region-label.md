---
'@manti-ui/react': patch
---

Toast: add `translations.regionLabel` to `createToaster`, so the toast region's accessible name can be localized. When set it is used verbatim, replacing Zag's composed `Notifications, <placement> (alt+T)`. Partial `translations` now merge with the defaults instead of dropping `closeTriggerLabel`.
