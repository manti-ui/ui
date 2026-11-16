---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
'@manti-ui/oklava': patch
---

The default primary is now Radix `tomato` instead of Radix `orange`. `@manti-ui/tokens` adds the `tomato` scale to `colorScales` and `tomatoA` to `alphaScales`, and the default `manti` preset names `tomato` as its primary. `@manti-ui/styles` generates `--manti-tomato-1…12` and `--manti-tomato-a1…a12`, points the `primary` variant, `--manti-accent-fill` and `--manti-selection-bg` at the tomato steps, adds the Tailwind `tomato-*` utilities and moves `primary-*` onto tomato. Oklava's primary picker now starts on tomato. The `orange` scale is still generated and available, so `--manti-orange-*` and `bg-orange-*` keep working.
