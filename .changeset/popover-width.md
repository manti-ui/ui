---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
'@manti-ui/react': patch
---

`Popover` gains `width`, `maxWidth` and `contentProps`. `width` and `maxWidth` write the `--manti-popover-width` (new, default `max-content`) and `--manti-popover-max-width` component tokens on the content part, so a wider panel needs no CSS. `contentProps` merges attributes onto the content part the way `Menu` does, with the machine's props winning. The panel's max width is now clamped to the viewport less a `--manti-space-8` gutter, and the title and description wrap long words instead of overflowing the panel.
