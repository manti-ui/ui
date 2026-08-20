---
'@manti-ui/tokens': minor
'@manti-ui/styles': minor
---

Ship the Theme Studio presets as importable themes.

The studio's six starting points existed only as TypeScript objects inside the
studio app: liking Ocean meant opening the studio, clicking the preset, and
pasting a generated stylesheet into your project. They are now a `presets` map
in `@manti-ui/tokens` and a stylesheet per preset in `@manti-ui/styles`, so
adopting one is a single import:

```css
@import '@manti-ui/styles/index.css';
@import '@manti-ui/styles/themes/ocean.css';
```

`violet`, `ocean`, `forest`, `rose`, and `graphite` ship as files; the default
theme is a no-op and needs none. Each carries the whole preset, not just color:
the `--variant-*` ramps expanded from its base colors, `--manti-cool-hue`,
`--manti-radius-factor`, Graphite's density, and the two branded roles no
`[data-variant]` block can reach — `--manti-accent-fill` and
`--manti-selection-*`. Skipping those last two is what used to leave a stray
orange progress bar and text selection behind a re-skinned app.

`@manti-ui/styles/themes.css` carries every preset scoped to
`[data-manti-theme='<id>']` for pages that show more than one at a time. Nested
scopes re-declare the neutral ramp, surfaces, radius steps, and spacing locally,
because a custom property inherits its already-substituted value.

Theme files live in the new `manti.theme` cascade layer, declared after
`manti.tokens`: a preset beats the token defaults regardless of import order,
and still loses to a consumer's own unlayered overrides.

Everything is generated from the contract by
`packages/styles/scripts/gen-preset-css.mjs`, with a `--check` gate in the
styles build. `check:contrast` and `check:color-scale` now run per preset too,
so a theme that fails the contrast floor or inverts an interaction ladder fails
the build. That gate moved Ocean's `info` a stop darker than the studio swatch —
no ink clears AA on `#0284c7`.
