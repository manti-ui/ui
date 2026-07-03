# @manti-ui/react

## 0.2.0

### Minor Changes

- **Calendar** — a new standalone month-grid component (weekday header + six-row day grid) built on the Zag.js `date-picker` machine in inline mode, with `selectionMode` (single/multiple/range), a `tone` highlight, `readOnly`, `fixedWeeks`, and a `renderDay(day)` slot ([#48](https://github.com/manti-ui/ui/pull/48)).
- **ColorPicker** — a copy area with HEX/RGBA/HSLA format tabs over a one-click Clipboard field, plus an eyedropper button. **Breaking:** the editable hex `channel-input` part is removed in favor of the read-only Clipboard field ([#52](https://github.com/manti-ui/ui/pull/52)).
- **Tabs** — a `size` prop (`'sm' | 'md'`, default `md`) whose `sm` variant tightens the gap, trigger padding, and font for compact usage ([#51](https://github.com/manti-ui/ui/pull/51)).
- **TagsInput** — flatten the tag item anatomy so each tag renders as a single `item-preview` span, and tighten the control padding. **Breaking:** the outer `data-part='item'` wrapper is no longer rendered ([#57](https://github.com/manti-ui/ui/pull/57)).

### Patch Changes

- Updated dependencies:
  - @manti-ui/styles@0.2.0
  - @manti-ui/tokens@0.2.0
  - @manti-ui/folds@0.2.0

## 0.1.5

### Patch Changes

- Updated dependencies [[`599d6f1`](https://github.com/manti-ui/ui/commit/599d6f19e2848bbde0c1331363ef8bdfc98851f1), [`599d6f1`](https://github.com/manti-ui/ui/commit/599d6f19e2848bbde0c1331363ef8bdfc98851f1)]:
  - @manti-ui/styles@0.1.5
  - @manti-ui/tokens@0.1.5
  - @manti-ui/folds@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [[`c41eb8a`](https://github.com/manti-ui/ui/commit/c41eb8a6d912a6215d6a2e270dcfdae07ba95578)]:
  - @manti-ui/tokens@0.1.4
  - @manti-ui/styles@0.1.4
  - @manti-ui/folds@0.1.4

## 0.1.3

### Patch Changes

- [#41](https://github.com/manti-ui/ui/pull/41) [`ee4c699`](https://github.com/manti-ui/ui/commit/ee4c6999da17401776eea8e7668fa520bd0da98c) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - **ColorPicker** — center the hue/alpha slider thumb (it previously sat low
  because Zag positions the channel thumb with `top: 50%` but adds no centering
  transform, unlike the area thumb) and stop the slider track from clipping it.
  Add a `showValueText` prop (default `true`) so the trigger can show only the
  color swatch, hiding the formatted value text.
- Updated dependencies [[`ee4c699`](https://github.com/manti-ui/ui/commit/ee4c6999da17401776eea8e7668fa520bd0da98c)]:
  - @manti-ui/styles@0.1.3
  - @manti-ui/tokens@0.1.3
  - @manti-ui/folds@0.1.3
