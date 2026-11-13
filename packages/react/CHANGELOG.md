# @manti-ui/react

## 0.14.0

### Minor Changes

- [#184](https://github.com/manti-ui/ui/pull/184) [`3ce2dd1`](https://github.com/manti-ui/ui/commit/3ce2dd1af7145d773deceb0ca44e22b1645c6520) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - `Combobox` can back a remote search. New props: `inputValue`, `defaultInputValue` and `onInputValueChange` control the typed text; `filter={false}` renders `items` as given, and a `filter` function replaces the built-in label match; `loading` shows a spinner row announced through `role="status"`; `emptyContent` fills the open listbox when it has no rows; `minChars` keeps the listbox closed until the query is long enough. A pick now survives an `items` update that no longer holds it, and multi-select chips keep their labels. The popup joins the control's seam when it shows only the loading or empty row. Without the new props, behavior is unchanged.

  New `loading` and `empty` anatomy parts, and three registered component tokens: `--manti-combobox-status-padding-y`, `--manti-combobox-status-padding-x` and `--manti-combobox-status-gap`.

- [#153](https://github.com/manti-ui/ui/pull/153) [`164d1c6`](https://github.com/manti-ui/ui/commit/164d1c659a4dd09e7641e84ff24ef5e4cfacc996) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Types: the published `.d.ts` files now import each other by full paths (`./meta.js`, `./components/index.js`), so an app type checked with `"moduleResolution": "NodeNext"` or `"Node16"` sees every export. `@manti-ui/styles` no longer declares a side-effect `./index.css` import in its types; the stylesheet still ships as `@manti-ui/styles/index.css`. The runtime JavaScript is unchanged.

- [#183](https://github.com/manti-ui/ui/pull/183) [`dac2ee2`](https://github.com/manti-ui/ui/commit/dac2ee2d6a0eda7f54a21a9d866ef8e51b60192c) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - `Popover` gains `width`, `maxWidth` and `contentProps`. `width` and `maxWidth` write the `--manti-popover-width` (new, default `max-content`) and `--manti-popover-max-width` component tokens on the content part, so a wider panel needs no CSS. `contentProps` merges attributes onto the content part the way `Menu` does, with the machine's props winning. The panel's max width is now clamped to the viewport less a `--manti-space-8` gutter, and the title and description wrap long words instead of overflowing the panel.

- [#190](https://github.com/manti-ui/ui/pull/190) [`abbbfb5`](https://github.com/manti-ui/ui/commit/abbbfb54c9676c86dd1250f0a4b55f880da3d1ca) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - `PortalContainerProvider` lets an app say where Manti overlays mount. Every overlay rendered below it (Menu, Select, Combobox, Popover, HoverCard, Dialog, Drawer, the pickers, FloatingPanel, Tour, Toast) portals into the provider's `container` instead of `document.body`, so an overlay opened inside the app's own `showModal()` dialog or `popover` element paints above it and takes input. An overlay's explicit container, such as Tooltip's `portalContainer`, still wins, and with no provider nothing changes.

- [#167](https://github.com/manti-ui/ui/pull/167) [`0a3106c`](https://github.com/manti-ui/ui/commit/0a3106c3dba00ae42f980bfc9e41039178fb1ba3) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Color now comes from Radix Colors, and this ships as the 0.14.0 minor. The bump type is `patch` on purpose: with the `fixed` package group, a `minor` changeset moves a 0.x version to 1.0.0, so 0.14.0 is cut by hand and this entry carries the notes.

  **`--manti-{hue}-{N}` changes meaning.** Each primitive scale (`gray`, `orange`, `green`, `amber`, `red`, `blue`) is now the 12-step scale of the same name in `@radix-ui/colors`, with `gray` backed by Radix `slate`. A step used to be one fixed lightness that ran light to dark. Now each step is a `light-dark()` pair of the Radix light and dark step with the same number, so it names a job in both schemes: `--manti-gray-1` is the app background in light and in dark, `9` is the solid fill, `12` is high-contrast text. Role names (`--manti-bg`, `--manti-text`, `--manti-border`, ...) and the `--variant-*` vocabulary keep their names and jobs. Anything that reads a raw step directly, including the Tailwind bridge's `bg-orange-500` style utilities and stylesheets exported from Theme Studio, gets a different color and should be checked in both schemes.

  **Roles follow the Radix steps exactly.** The neutral `--manti-focus-ring` is `gray-8`. `--manti-warning-text` and every variant's `--variant-soft-text` use step 11. `--manti-text-subtle` now shares step 11 with `--manti-text-muted`. Labels on solid fills use the new fixed inks `--manti-ink-light` and `--manti-ink-dark`, through `--manti-text-on-accent` and the new `--manti-text-on-bright`, picked by Radix's step 9 rule (`radixInk`): light on every scale except Sky, Mint, Lime, Yellow and Amber. The contrast check reports these Radix-fixed pairs instead of gating them.

  **`--manti-cool-hue` is removed.** The neutral is no longer tinted from one hue. To move it, pick another Radix gray: a preset on that gray, Oklava, Theme Studio, or the `--manti-gray-*` overrides written from the catalog below. A stylesheet that still sets `--manti-cool-hue` changes nothing.

  **Presets name Radix scales.** `MantiPresetDefinition` drops `coolHue` and free color strings: `colors` names a Radix scale per variant and `neutral` names a Radix gray. Violet is `violet` on `mauve`, Ocean `sky` on `slate`, Forest `grass` on `sage`, Rose `ruby` on `mauve`, Graphite `slate` on `slate`.

  **`@manti-ui/tokens`** adds the `radixScales` catalog (25 accents and 6 grays, light and dark steps each, and the gray each accent pairs with), `radixAccentScaleNames`, `radixGrayScaleNames`, `colorScales`, `alphaScales` and `colorInks`, and the `MantiRadixScale`, `MantiRadixAccentScale`, `MantiRadixGrayScale`, `MantiRadixScaleEntry`, `MantiColorScale` and `MantiScaleStep` types. `colorPrimitives` now holds the `light-dark()` value of each step.

  **`@manti-ui/oklava`** picks every variant and the neutral by Radix scale name instead of a free color. Removed: `toHex`, `ACCENT_COLORS`, `NEUTRAL_HUES` and the `neutralHue` theme field. Added: `COLOR_SCALES`, `NEUTRAL_SCALES`, `scaleOf`, `scaleLabel` and the `neutral` theme field. A saved Oklava theme from an earlier version keeps its other settings, and its hex colors and neutral hue fall back to its preset's Radix scales.

- [`5c7eaac`](https://github.com/manti-ui/ui/commit/5c7eaac7d50cf19272a6e3cb316a6e92b96a83dc) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Toast: add `translations.regionLabel` to `createToaster`, so the toast region's accessible name can be localized. When set it is used verbatim, replacing Zag's composed `Notifications, <placement> (alt+T)`. Partial `translations` now merge with the defaults instead of dropping `closeTriggerLabel`.

- [#180](https://github.com/manti-ui/ui/pull/180) [`1fd903e`](https://github.com/manti-ui/ui/commit/1fd903ebcd45c9b10cfc2a3868b8a8d91b54d21b) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - TreeView: add controlled `expandedValue` and `selectedValue` props and an `onExpandedChange(value: string[])` callback, so a parent that owns the open and selected rows can drive the tree by changing props, without remounting it. `defaultExpandedValue` and `defaultSelectedValue` keep working for uncontrolled use.

- [#187](https://github.com/manti-ui/ui/pull/187) [`5b74ec0`](https://github.com/manti-ui/ui/commit/5b74ec00955ab078177dcba220848f4a53998689) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - `Menu` and `Popover` no longer require a `trigger`. Without one, open the panel with `open` and place it with the new `getAnchorRect` prop, which also works beside a trigger and keeps `placement` relative to the rect. `Popover` forwards `initialFocusEl`, `finalFocusEl`, `restoreFocus` and `persistentElements` to its machine. `Menu` gains `finalFocusEl` and `restoreFocus`, implemented in the adapter because the Zag menu machine has neither. With no trigger, both send focus on close back to the element that had it when the panel opened. With a trigger and none of the new props, behavior is unchanged.

- Updated dependencies [[`3ce2dd1`](https://github.com/manti-ui/ui/commit/3ce2dd1af7145d773deceb0ca44e22b1645c6520), [`d876d65`](https://github.com/manti-ui/ui/commit/d876d65e12bb71f40d25fbad57dad483875f35ac), [`565daf2`](https://github.com/manti-ui/ui/commit/565daf2ef48cfd78c73a88c1e07478842202840b), [`a194f8a`](https://github.com/manti-ui/ui/commit/a194f8a6fc0005c8c5077b5ca7f399c497518e35), [`164d1c6`](https://github.com/manti-ui/ui/commit/164d1c659a4dd09e7641e84ff24ef5e4cfacc996), [`dac2ee2`](https://github.com/manti-ui/ui/commit/dac2ee2d6a0eda7f54a21a9d866ef8e51b60192c), [`0a3106c`](https://github.com/manti-ui/ui/commit/0a3106c3dba00ae42f980bfc9e41039178fb1ba3)]:
  - @manti-ui/tokens@0.14.0
  - @manti-ui/styles@0.14.0
  - @manti-ui/folds@0.14.0

## 0.11.1

### Patch Changes

- Updated dependencies [[`5928baf`](https://github.com/manti-ui/ui/commit/5928bafa5caf7fc1959d2ac71df9bbed0e70a669)]:
  - @manti-ui/tokens@0.11.1
  - @manti-ui/styles@0.11.1
  - @manti-ui/folds@0.11.1

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
