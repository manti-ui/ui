---
'@manti-ui/styles': patch
'@manti-ui/react': minor
---

Drop the Popover arrow and document every placement.

The arrow drew a notch that broke the panel's silhouette — a small tinted wedge
between the trigger and the top edge of the panel, with its own border seam. The
panel is anchored by its offset alone, so the wedge carried no information the
position did not already give. The `showArrow` prop and the `arrow` part are
gone; the panel is arrowless in every placement.

`placement` is unchanged and still defaults to `bottom`, but it is now shown in
the docs: all twelve popper placements (`top`/`right`/`bottom`/`left`, each with
a `-start` and `-end` alignment) render as a live demo alongside a Storybook
`Placements` story.
