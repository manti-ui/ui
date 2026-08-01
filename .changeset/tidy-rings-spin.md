---
'@manti-ui/tokens': minor
'@manti-ui/styles': patch
'@manti-ui/react': patch
---

Fix the circular Progress ring and give it a thickness token.

Zag sizes the ring inline from `--size` / `--thickness` (the svg's width and
height, the circle's `cx`/`cy`/`r`/`stroke-width`), and those inline
declarations beat the stylesheet — neither var was defined, so the whole ring
collapsed to an unsized svg. Both are now derived from
`--manti-progress-circle-size` and the new
`--manti-progress-circle-thickness` component token, which tracks the `sm`,
`md`, and `lg` sizes.

The indeterminate circular state now animates a quarter-arc around the track
instead of sitting still, and the value text renders through
`getValueTextProps()` — so it is announced, and it reads the same
`valueAsString` as the linear variant. `showValue` no longer draws a duplicate
header above the ring.
