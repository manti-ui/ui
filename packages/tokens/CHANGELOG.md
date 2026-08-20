# @manti-ui/tokens

## 1.0.0

### Minor Changes

- [#97](https://github.com/manti-ui/ui/pull/97) [`c7aeeb5`](https://github.com/manti-ui/ui/commit/c7aeeb5c097015cf5afde9bdbca11fa8e47dc7e5) Thanks [@tuna4ll](https://github.com/tuna4ll)! - Ship the Theme Studio presets as importable themes.

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

## 0.2.0

### Minor Changes

- Register new component tokens: `--manti-calendar-day-min-height`, `--manti-calendar-day-padding`, and `--manti-calendar-radius` for the new Calendar ([#48](https://github.com/manti-ui/ui/pull/48)); `--manti-button-cursor` ([#54](https://github.com/manti-ui/ui/pull/54)); and `--manti-checkbox-indicator-size` ([#55](https://github.com/manti-ui/ui/pull/55)).

## 0.1.5

## 0.1.4

### Patch Changes

- [#45](https://github.com/manti-ui/ui/pull/45) [`c41eb8a`](https://github.com/manti-ui/ui/commit/c41eb8a6d912a6215d6a2e270dcfdae07ba95578) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - **Splitter** — rework the resize handle so it grows visually without reflowing
  the panels: the trigger is now a fixed-width grab track holding a thin line
  (drawn with `::before`) that tones and widens via an outline on hover/drag,
  instead of animating the track's own width. The widen/tone is keyed on
  `:hover`/`[data-dragging]` (not `[data-focus]`) so the handle no longer stays
  stuck in the active tone after a mouse drag ends. Adds three component tokens —
  `--manti-splitter-handle-size`, `--manti-splitter-line-size`, and
  `--manti-splitter-line-size-active`.

## 0.1.3
