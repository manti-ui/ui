---
'@manti-ui/tokens': minor
'@manti-ui/styles': patch
'@manti-ui/react': patch
---

Fix Slider `marks` so the tick dots sit where their values are.

Zag positions each marker at `inset-inline-start: <percent>` (or `bottom:` when
vertical) of the marker group, but the group's children are all absolutely
positioned, so as a flex item of the control it collapsed to zero width. Every
percentage resolved against `0`, and the whole set of ticks piled up on a single
point at the end of the track, so `marks` was effectively a broken prop.

The control is now a one-cell grid stack, so the track and the marker group
share the same box and the markers get the track's real length to position
against. (The group keeps Zag's inline `position: relative`, which no stylesheet
rule can outrank, so the fix sizes the box rather than re-positioning it.)

Each dot is also pulled back half its size on the axis Zag does not centre, and
a tick the range has already passed switches to `--variant-on-solid` so it stays
visible on the filled track instead of disappearing into it. The dot size is now
the `--manti-slider-marker-size` component token.

The React adapter renders the marker group before the thumbs: with every part in
one grid cell, DOM order is paint order, and a tick at the current value used to
show through the handle standing on it.
