# @manti-ui/tokens

## 1.0.0

### Minor Changes

- [#89](https://github.com/manti-ui/ui/pull/89) [`3b90e4a`](https://github.com/manti-ui/ui/commit/3b90e4aa9180c0839fc2e546177f92530c905aad) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Fix Slider `marks` so the tick dots sit where their values are.

  Zag positions each marker at `inset-inline-start: <percent>` (or `bottom:` when
  vertical) of the marker group, but the group's children are all absolutely
  positioned, so as a flex item of the control it collapsed to zero width. Every
  percentage resolved against `0`, and the whole set of ticks piled up on a single
  point at the end of the track, so `marks` was effectively a broken prop.

  The control is now a one-cell grid stack, so the track and the marker group
  share the same box and the markers get the track's real length to position
  against. (The group keeps Zag's inline `position: relative`, which no stylesheet
  rule can outrank, so the fix sizes the box rather than re-positioning it.)

  Each dot is also pulled back half its size on the axis Zag does not centre, and
  a tick the range has already passed switches to `--variant-on-solid` so it stays
  visible on the filled track instead of disappearing into it. The dot size is now
  the `--manti-slider-marker-size` component token.

  The React adapter renders the marker group before the thumbs: with every part in
  one grid cell, DOM order is paint order, and a tick at the current value used to
  show through the handle standing on it.

- [#89](https://github.com/manti-ui/ui/pull/89) [`3b90e4a`](https://github.com/manti-ui/ui/commit/3b90e4aa9180c0839fc2e546177f92530c905aad) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Make a control's popup adopt the control's size.

  A `sm` Select opened a listbox with `md` rows: the popup is portalled out of the
  control, so `data-size` on the root never reached it, and every popup rendered at
  one fixed size no matter what the trigger was set to. The same held for Combobox,
  and Menu, Listbox, DatePicker, TimePicker, and ColorPicker had no `size` at all.

  `sm | md | lg` is now one shared rhythm, resolved from a `--manti-size-*` channel
  in `packages/styles/src/size.css`: type, supporting type, icon, control height and
  padding, panel padding and gap, item padding, gap and radius, and the square cell
  used by calendar and time grids. Every value derives from the spacing, type,
  radius, and control-height scales, so retuning `--manti-space-1` or
  `--manti-text-base` rescales popups too, and a theme can retune a single step by
  redeclaring one channel variable under `[data-size='sm']`.

  Each adapter re-stamps `data-size` on its positioner, so the portalled surface
  resolves the same step as the control that opened it. Menu and ContextMenu gain a
  `size` prop that submenus inherit; Listbox, DatePicker, TimePicker, and ColorPicker
  gain one too. ColorPicker's panel is a saturation canvas with no rows to rescale,
  so `size` there covers the trigger.

  Every sizing value on those surfaces is now a component token defaulting to the
  channel (`--manti-select-item-padding-y`, `--manti-menu-item-font-size`,
  `--manti-date-picker-cell-size`, and so on), so a single component can still be
  overridden on its own.

  Two knock-on changes: field-backed controls (Input, Textarea) now scale their type
  with `size` instead of holding at `--manti-text-sm`, so a `sm` input matches a `sm`
  Select beside it, and Select's rows pick up the same horizontal padding as
  Combobox, Menu, and Listbox rows.

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
