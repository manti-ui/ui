---
'@manti-ui/styles': patch
'@manti-ui/react': patch
---

**ColorPicker** — center the hue/alpha slider thumb (it previously sat low
because Zag positions the channel thumb with `top: 50%` but adds no centering
transform, unlike the area thumb) and stop the slider track from clipping it.
Add a `showValueText` prop (default `true`) so the trigger can show only the
color swatch, hiding the formatted value text.
