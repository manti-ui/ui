---
'@manti-ui/styles': patch
---

fix(clipboard): keep the focus border neutral, tint only when copied (#53)

`:focus-within` used `--tone-ring` for the control border, so with the default `tone="success"` simply focusing the field turned it green — indistinguishable from the copied confirmation. Focus now uses the neutral `--manti-focus-ring`, and a new `&[data-copied]` rule applies the tone ring only during the copied timeout.
