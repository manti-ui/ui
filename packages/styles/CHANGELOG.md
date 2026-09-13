# @manti-ui/styles

## 0.11.1

### Patch Changes

- [#100](https://github.com/manti-ui/ui/pull/100) [`5928baf`](https://github.com/manti-ui/ui/commit/5928bafa5caf7fc1959d2ac71df9bbed0e70a669) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Steady the seams, the leading, and the radius of single-line controls.

  **Select and Combobox** kept a connected popup honest by painting the shared
  edge `transparent`, which let the panel behind show through as a pale line and
  still reserved the border's width. Both now zero the width on the seam side
  only — the trigger keeps the neutral `--manti-border` while open, the popup
  drops its own seam edge, and neither paints a second line along the join. The
  popup's outside corners resolve from the same clamped radius as the trigger, so
  `round` and `pill` cannot produce a mismatched pair.

  **Leading.** Single-line controls now share one vertical rhythm through the new
  `--manti-leading-control` token, declared once in `styles/index.css` for every
  control that renders one line of text. Components no longer invent their own
  value: Segmented Control's item text inherits the shared leading instead of
  pinning `--manti-leading-none`, and Checkbox's box is `vertical-align: middle`
  so a toggle no longer re-measures the line box around it. That last one was
  visible in DataTable, where checking the select-all box shortened the header row
  by ~1px and shifted every body row with it.

  **Radius.** `--manti-size-control-radius` steps one stop tighter than the panel
  radius at `md` and `lg`, and the `round` profile's factor moves `1.4` → `1.2`;
  together they stop a default-size button from reading as a pill.

  **Listbox** items highlight and press on their own variant's soft ladder rather
  than the neutral wash, hover and roving focus land on the same surface, and a
  checked row holds the `active` rung so selection stays legible under the
  keyboard. The cursor is `default`, matching a listbox rather than a link.

  Also: the DatePicker trigger drops the UA button padding it was inheriting.

- Updated dependencies [[`5928baf`](https://github.com/manti-ui/ui/commit/5928bafa5caf7fc1959d2ac71df9bbed0e70a669)]:
  - @manti-ui/tokens@0.11.1

## 0.2.0

### Minor Changes

- **Button** — expose a `--manti-button-cursor` component token (default `default`) so an app can set the cursor globally via one variable; the pressed state is also simplified to a crisper `translateY(1px)` nudge ([#54](https://github.com/manti-ui/ui/pull/54)).
- **Checkbox** — expose a `--manti-checkbox-indicator-size` component token controlling the check indicator's size within the control, with per-size defaults ([#55](https://github.com/manti-ui/ui/pull/55)).
- **Switch** — the thumb squishes (shrinks in height) while the control is pressed, for a more tactile press ([#56](https://github.com/manti-ui/ui/pull/56)).
- **Calendar** / **ColorPicker** / **Tabs** — styles for the new Calendar month grid, the ColorPicker copy row, and the compact `sm` Tabs size ([#48](https://github.com/manti-ui/ui/pull/48), [#52](https://github.com/manti-ui/ui/pull/52), [#51](https://github.com/manti-ui/ui/pull/51)).

### Patch Changes

- Updated dependencies:
  - @manti-ui/tokens@0.2.0

## 0.1.5

### Patch Changes

- [#61](https://github.com/manti-ui/ui/pull/61) [`599d6f1`](https://github.com/manti-ui/ui/commit/599d6f19e2848bbde0c1331363ef8bdfc98851f1) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - fix(clipboard): keep the focus border neutral, tint only when copied ([#53](https://github.com/manti-ui/ui/issues/53))

  `:focus-within` used `--tone-ring` for the control border, so with the default `tone="success"` simply focusing the field turned it green — indistinguishable from the copied confirmation. Focus now uses the neutral `--manti-focus-ring`, and a new `&[data-copied]` rule applies the tone ring only during the copied timeout.

- [#61](https://github.com/manti-ui/ui/pull/61) [`599d6f1`](https://github.com/manti-ui/ui/commit/599d6f19e2848bbde0c1331363ef8bdfc98851f1) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - fix(tabs): scope trigger/indicator styles to the list's direct children ([#50](https://github.com/manti-ui/ui/issues/50))

  Tabs variant rules matched any descendant `[data-part='trigger']`/`[data-part='indicator']` under the root, so components rendered inside tab content (e.g. a Clipboard's icon wrappers) leaked the sliding-thumb chrome. Both parts are now anchored through `> [data-part='list'] >`, leaving embedded components untouched with no visual change to the tabs themselves.

- Updated dependencies []:
  - @manti-ui/tokens@0.1.5

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
- Updated dependencies [[`c41eb8a`](https://github.com/manti-ui/ui/commit/c41eb8a6d912a6215d6a2e270dcfdae07ba95578)]:
  - @manti-ui/tokens@0.1.4

## 0.1.3

### Patch Changes

- [#41](https://github.com/manti-ui/ui/pull/41) [`ee4c699`](https://github.com/manti-ui/ui/commit/ee4c6999da17401776eea8e7668fa520bd0da98c) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - **ColorPicker** — center the hue/alpha slider thumb (it previously sat low
  because Zag positions the channel thumb with `top: 50%` but adds no centering
  transform, unlike the area thumb) and stop the slider track from clipping it.
  Add a `showValueText` prop (default `true`) so the trigger can show only the
  color swatch, hiding the formatted value text.
- Updated dependencies []:
  - @manti-ui/tokens@0.1.3
