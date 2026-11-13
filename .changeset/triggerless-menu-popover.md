---
'@manti-ui/react': patch
---

`Menu` and `Popover` no longer require a `trigger`. Without one, open the panel with `open` and place it with the new `getAnchorRect` prop, which also works beside a trigger and keeps `placement` relative to the rect. `Popover` forwards `initialFocusEl`, `finalFocusEl`, `restoreFocus` and `persistentElements` to its machine. `Menu` gains `finalFocusEl` and `restoreFocus`, implemented in the adapter because the Zag menu machine has neither. With no trigger, both send focus on close back to the element that had it when the panel opened. With a trigger and none of the new props, behavior is unchanged.
