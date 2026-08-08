---
'@manti-ui/styles': patch
'@manti-ui/react': patch
---

Carry the panel hairline around the Tooltip, HoverCard, and Tour arrows.

The bubbles draw a `--manti-panel-border` outline, but the arrow tip drew only a
background — so the notch punched a borderless gap in that outline and read as a
rendering artifact rather than part of the bubble.

Zag rotates the tip square 45° per side, which always leaves its top and left
edges facing away from the bubble, so the hairline goes on exactly those two
(physical properties, matching the physical rotation Zag writes inline). The
outline now runs continuously through the notch in every placement.

The Tour arrow also inherited the wrong material: an opaque `surface-raised` tip
against a `panel-tint-strong` card showed up as a lighter patch stuck to its
edge. It now uses the same panel tint as the card it belongs to.

Tooltip never rendered an arrow at all — the stylesheet has carried arrow rules
since the component was adapted, but the React adapter skipped the part, so they
were dead. It now renders the arrow like HoverCard does, behind the same
`showArrow` prop (default `true`).
