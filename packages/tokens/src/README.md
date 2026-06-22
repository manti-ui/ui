# Tokens

The typed Manti UI token contract: six OKLCH color ramps (`gray`, `orange`,
`green`, `amber`, `red`, `blue`), plus `tones`, `radius`, `space`, `fontSize`,
`lineHeight`, `fontWeight`, `fontFamily`, `shadow`, `duration`, `easing`,
`breakpoint`, and `zIndex`.

This package is the typed source of truth and stays framework-agnostic. The same
values are mirrored as CSS custom properties in `@manti-ui/styles`, where
light/dark resolution is handled with the CSS `light-dark()` function.
