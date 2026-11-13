# @manti-ui/styles

## 0.14.0

### Minor Changes

- [#184](https://github.com/manti-ui/ui/pull/184) [`3ce2dd1`](https://github.com/manti-ui/ui/commit/3ce2dd1af7145d773deceb0ca44e22b1645c6520) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - `Combobox` can back a remote search. New props: `inputValue`, `defaultInputValue` and `onInputValueChange` control the typed text; `filter={false}` renders `items` as given, and a `filter` function replaces the built-in label match; `loading` shows a spinner row announced through `role="status"`; `emptyContent` fills the open listbox when it has no rows; `minChars` keeps the listbox closed until the query is long enough. A pick now survives an `items` update that no longer holds it, and multi-select chips keep their labels. The popup joins the control's seam when it shows only the loading or empty row. Without the new props, behavior is unchanged.

  New `loading` and `empty` anatomy parts, and three registered component tokens: `--manti-combobox-status-padding-y`, `--manti-combobox-status-padding-x` and `--manti-combobox-status-gap`.

- [#191](https://github.com/manti-ui/ui/pull/191) [`d876d65`](https://github.com/manti-ui/ui/commit/d876d65e12bb71f40d25fbad57dad483875f35ac) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Complete the component-token sweep: drawer, editable, hover-card, navigation-menu, pagination, pin-input, rating-group, scroll-area, signature-pad, steps, tags-input and toggle now expose their structural values (radius, padding, gap, font size and similar) as public `--manti-{component}-*` tokens registered in `componentTokens`. Every new token defaults to the value it replaced, so nothing renders differently.

- [#185](https://github.com/manti-ui/ui/pull/185) [`a194f8a`](https://github.com/manti-ui/ui/commit/a194f8a6fc0005c8c5077b5ca7f399c497518e35) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Add `--manti-font-display`, the face of `Heading` and every component title part (Card, Dialog, Drawer, Popover, Alert, Toast, Tour, FloatingPanel, DataTable, and the Steps item title). It is the new `display` key of `fontFamily` in `@manti-ui/tokens` and defaults to `var(--manti-font-sans)`, so nothing changes until a theme sets it. The Tailwind theme maps it to `--font-display`.

- [#153](https://github.com/manti-ui/ui/pull/153) [`164d1c6`](https://github.com/manti-ui/ui/commit/164d1c659a4dd09e7641e84ff24ef5e4cfacc996) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Types: the published `.d.ts` files now import each other by full paths (`./meta.js`, `./components/index.js`), so an app type checked with `"moduleResolution": "NodeNext"` or `"Node16"` sees every export. `@manti-ui/styles` no longer declares a side-effect `./index.css` import in its types; the stylesheet still ships as `@manti-ui/styles/index.css`. The runtime JavaScript is unchanged.

- [#183](https://github.com/manti-ui/ui/pull/183) [`dac2ee2`](https://github.com/manti-ui/ui/commit/dac2ee2d6a0eda7f54a21a9d866ef8e51b60192c) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - `Popover` gains `width`, `maxWidth` and `contentProps`. `width` and `maxWidth` write the `--manti-popover-width` (new, default `max-content`) and `--manti-popover-max-width` component tokens on the content part, so a wider panel needs no CSS. `contentProps` merges attributes onto the content part the way `Menu` does, with the machine's props winning. The panel's max width is now clamped to the viewport less a `--manti-space-8` gutter, and the title and description wrap long words instead of overflowing the panel.

- [#167](https://github.com/manti-ui/ui/pull/167) [`0a3106c`](https://github.com/manti-ui/ui/commit/0a3106c3dba00ae42f980bfc9e41039178fb1ba3) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Color now comes from Radix Colors, and this ships as the 0.14.0 minor. The bump type is `patch` on purpose: with the `fixed` package group, a `minor` changeset moves a 0.x version to 1.0.0, so 0.14.0 is cut by hand and this entry carries the notes.

  **`--manti-{hue}-{N}` changes meaning.** Each primitive scale (`gray`, `orange`, `green`, `amber`, `red`, `blue`) is now the 12-step scale of the same name in `@radix-ui/colors`, with `gray` backed by Radix `slate`. A step used to be one fixed lightness that ran light to dark. Now each step is a `light-dark()` pair of the Radix light and dark step with the same number, so it names a job in both schemes: `--manti-gray-1` is the app background in light and in dark, `9` is the solid fill, `12` is high-contrast text. Role names (`--manti-bg`, `--manti-text`, `--manti-border`, ...) and the `--variant-*` vocabulary keep their names and jobs. Anything that reads a raw step directly, including the Tailwind bridge's `bg-orange-500` style utilities and stylesheets exported from Theme Studio, gets a different color and should be checked in both schemes.

  **Roles follow the Radix steps exactly.** The neutral `--manti-focus-ring` is `gray-8`. `--manti-warning-text` and every variant's `--variant-soft-text` use step 11. `--manti-text-subtle` now shares step 11 with `--manti-text-muted`. Labels on solid fills use the new fixed inks `--manti-ink-light` and `--manti-ink-dark`, through `--manti-text-on-accent` and the new `--manti-text-on-bright`, picked by Radix's step 9 rule (`radixInk`): light on every scale except Sky, Mint, Lime, Yellow and Amber. The contrast check reports these Radix-fixed pairs instead of gating them.

  **`--manti-cool-hue` is removed.** The neutral is no longer tinted from one hue. To move it, pick another Radix gray: a preset on that gray, Oklava, Theme Studio, or the `--manti-gray-*` overrides written from the catalog below. A stylesheet that still sets `--manti-cool-hue` changes nothing.

  **Presets name Radix scales.** `MantiPresetDefinition` drops `coolHue` and free color strings: `colors` names a Radix scale per variant and `neutral` names a Radix gray. Violet is `violet` on `mauve`, Ocean `sky` on `slate`, Forest `grass` on `sage`, Rose `ruby` on `mauve`, Graphite `slate` on `slate`.

  **`@manti-ui/tokens`** adds the `radixScales` catalog (25 accents and 6 grays, light and dark steps each, and the gray each accent pairs with), `radixAccentScaleNames`, `radixGrayScaleNames`, `colorScales`, `alphaScales` and `colorInks`, and the `MantiRadixScale`, `MantiRadixAccentScale`, `MantiRadixGrayScale`, `MantiRadixScaleEntry`, `MantiColorScale` and `MantiScaleStep` types. `colorPrimitives` now holds the `light-dark()` value of each step.

  **`@manti-ui/oklava`** picks every variant and the neutral by Radix scale name instead of a free color. Removed: `toHex`, `ACCENT_COLORS`, `NEUTRAL_HUES` and the `neutralHue` theme field. Added: `COLOR_SCALES`, `NEUTRAL_SCALES`, `scaleOf`, `scaleLabel` and the `neutral` theme field. A saved Oklava theme from an earlier version keeps its other settings, and its hex colors and neutral hue fall back to its preset's Radix scales.

- Updated dependencies [[`3ce2dd1`](https://github.com/manti-ui/ui/commit/3ce2dd1af7145d773deceb0ca44e22b1645c6520), [`d876d65`](https://github.com/manti-ui/ui/commit/d876d65e12bb71f40d25fbad57dad483875f35ac), [`565daf2`](https://github.com/manti-ui/ui/commit/565daf2ef48cfd78c73a88c1e07478842202840b), [`a194f8a`](https://github.com/manti-ui/ui/commit/a194f8a6fc0005c8c5077b5ca7f399c497518e35), [`164d1c6`](https://github.com/manti-ui/ui/commit/164d1c659a4dd09e7641e84ff24ef5e4cfacc996), [`dac2ee2`](https://github.com/manti-ui/ui/commit/dac2ee2d6a0eda7f54a21a9d866ef8e51b60192c), [`0a3106c`](https://github.com/manti-ui/ui/commit/0a3106c3dba00ae42f980bfc9e41039178fb1ba3)]:
  - @manti-ui/tokens@0.14.0

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
