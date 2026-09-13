# @manti-ui/tokens

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
