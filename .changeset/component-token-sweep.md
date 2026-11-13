---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
---

Complete the component-token sweep: drawer, editable, hover-card, navigation-menu, pagination, pin-input, rating-group, scroll-area, signature-pad, steps, tags-input and toggle now expose their structural values (radius, padding, gap, font size and similar) as public `--manti-{component}-*` tokens registered in `componentTokens`. Every new token defaults to the value it replaced, so nothing renders differently.
