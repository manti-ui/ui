---
'@manti-ui/folds': patch
'@manti-ui/react': patch
---

Update Zag.js from 1.41.2 to 1.43.0.

Fixes that land in Manti components without any API change: ContextMenu no
longer flashes at the top-left corner before positioning (and a long-press
context menu no longer opens stuck at `(0,0)`); DatePicker gains disabled /
read-only / controlled-open fixes, keyboard range selection matching the
pointer, and a `visibleRangeText` memo fix that surfaced as an SSR hydration
mismatch; TagsInput now submits its current tags in `FormData` instead of its
initial value; Toast stops flickering when an overlapped stack expands; Popover
and Dialog fix tabbing out of portalled content when the trigger is last on the
page; Tour fixes `action: "skip"` steps and cleanup when a step's `effect`
dismisses the tour; ColorPicker no longer commits a partial channel value when
`Enter` confirms an IME composition; Splitter honors `collapsedSize` and fixes
keyboard resizing on a hovered trigger; SignaturePad fixes controlled `paths`.

`@zag-js/time-picker` stays at 1.22.1 — upstream has not published it since.
