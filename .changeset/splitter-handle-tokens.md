---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
---

**Splitter** — rework the resize handle so it grows visually without reflowing
the panels: the trigger is now a fixed-width grab track holding a thin line
(drawn with `::before`) that tones and widens via an outline on hover/drag,
instead of animating the track's own width. The widen/tone is keyed on
`:hover`/`[data-dragging]` (not `[data-focus]`) so the handle no longer stays
stuck in the active tone after a mouse drag ends. Adds three component tokens —
`--manti-splitter-handle-size`, `--manti-splitter-line-size`, and
`--manti-splitter-line-size-active`.
