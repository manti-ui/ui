# @manti-ui/styles

## 1.0.0

### Minor Changes

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

### Patch Changes

- [#89](https://github.com/manti-ui/ui/pull/89) [`3b90e4a`](https://github.com/manti-ui/ui/commit/3b90e4aa9180c0839fc2e546177f92530c905aad) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Carry the panel hairline around the Tooltip, HoverCard, and Tour arrows.

  The bubbles draw a `--manti-panel-border` outline, but the arrow tip drew only a
  background — so the notch punched a borderless gap in that outline and read as a
  rendering artifact rather than part of the bubble.

  Zag rotates the tip square 45° per side, which always leaves its top and left
  edges facing away from the bubble, so the hairline goes on exactly those two
  (physical properties, matching the physical rotation Zag writes inline). The
  outline now runs continuously through the notch in every placement.

  The Tour arrow also inherited the wrong material: an opaque `surface-raised` tip
  against a `panel-tint-strong` card showed up as a lighter patch stuck to its
  edge. It now uses the same panel tint as the card it belongs to.

  Tooltip never rendered an arrow at all — the stylesheet has carried arrow rules
  since the component was adapted, but the React adapter skipped the part, so they
  were dead. It now renders the arrow like HoverCard does, behind the same
  `showArrow` prop (default `true`).

- [#89](https://github.com/manti-ui/ui/pull/89) [`3b90e4a`](https://github.com/manti-ui/ui/commit/3b90e4aa9180c0839fc2e546177f92530c905aad) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Drop the Popover arrow and document every placement.

  The arrow drew a notch that broke the panel's silhouette — a small tinted wedge
  between the trigger and the top edge of the panel, with its own border seam. The
  panel is anchored by its offset alone, so the wedge carried no information the
  position did not already give. The `showArrow` prop and the `arrow` part are
  gone; the panel is arrowless in every placement.

  `placement` is unchanged and still defaults to `bottom`, but it is now shown in
  the docs: all twelve popper placements (`top`/`right`/`bottom`/`left`, each with
  a `-start` and `-end` alignment) render as a live demo alongside a Storybook
  `Placements` story.

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

- Updated dependencies [[`3b90e4a`](https://github.com/manti-ui/ui/commit/3b90e4aa9180c0839fc2e546177f92530c905aad), [`3b90e4a`](https://github.com/manti-ui/ui/commit/3b90e4aa9180c0839fc2e546177f92530c905aad)]:
  - @manti-ui/tokens@1.0.0

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
