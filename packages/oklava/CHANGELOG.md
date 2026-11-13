# @manti-ui/oklava

## 0.14.0

### Minor Changes

- [#153](https://github.com/manti-ui/ui/pull/153) [`164d1c6`](https://github.com/manti-ui/ui/commit/164d1c659a4dd09e7641e84ff24ef5e4cfacc996) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Types: the published `.d.ts` files now import each other by full paths (`./meta.js`, `./components/index.js`), so an app type checked with `"moduleResolution": "NodeNext"` or `"Node16"` sees every export. `@manti-ui/styles` no longer declares a side-effect `./index.css` import in its types; the stylesheet still ships as `@manti-ui/styles/index.css`. The runtime JavaScript is unchanged.

- [#167](https://github.com/manti-ui/ui/pull/167) [`0a3106c`](https://github.com/manti-ui/ui/commit/0a3106c3dba00ae42f980bfc9e41039178fb1ba3) Thanks [@tutkuofnight](https://github.com/tutkuofnight)! - Color now comes from Radix Colors, and this ships as the 0.14.0 minor. The bump type is `patch` on purpose: with the `fixed` package group, a `minor` changeset moves a 0.x version to 1.0.0, so 0.14.0 is cut by hand and this entry carries the notes.

  **`--manti-{hue}-{N}` changes meaning.** Each primitive scale (`gray`, `orange`, `green`, `amber`, `red`, `blue`) is now the 12-step scale of the same name in `@radix-ui/colors`, with `gray` backed by Radix `slate`. A step used to be one fixed lightness that ran light to dark. Now each step is a `light-dark()` pair of the Radix light and dark step with the same number, so it names a job in both schemes: `--manti-gray-1` is the app background in light and in dark, `9` is the solid fill, `12` is high-contrast text. Role names (`--manti-bg`, `--manti-text`, `--manti-border`, ...) and the `--variant-*` vocabulary keep their names and jobs. Anything that reads a raw step directly, including the Tailwind bridge's `bg-orange-500` style utilities and stylesheets exported from Theme Studio, gets a different color and should be checked in both schemes.

  **Roles follow the Radix steps exactly.** The neutral `--manti-focus-ring` is `gray-8`. `--manti-warning-text` and every variant's `--variant-soft-text` use step 11. `--manti-text-subtle` now shares step 11 with `--manti-text-muted`. Labels on solid fills use the new fixed inks `--manti-ink-light` and `--manti-ink-dark`, through `--manti-text-on-accent` and the new `--manti-text-on-bright`, picked by Radix's step 9 rule (`radixInk`): light on every scale except Sky, Mint, Lime, Yellow and Amber. The contrast check reports these Radix-fixed pairs instead of gating them.

  **`--manti-cool-hue` is removed.** The neutral is no longer tinted from one hue. To move it, pick another Radix gray: a preset on that gray, Oklava, Theme Studio, or the `--manti-gray-*` overrides written from the catalog below. A stylesheet that still sets `--manti-cool-hue` changes nothing.

  **Presets name Radix scales.** `MantiPresetDefinition` drops `coolHue` and free color strings: `colors` names a Radix scale per variant and `neutral` names a Radix gray. Violet is `violet` on `mauve`, Ocean `sky` on `slate`, Forest `grass` on `sage`, Rose `ruby` on `mauve`, Graphite `slate` on `slate`.

  **`@manti-ui/tokens`** adds the `radixScales` catalog (25 accents and 6 grays, light and dark steps each, and the gray each accent pairs with), `radixAccentScaleNames`, `radixGrayScaleNames`, `colorScales`, `alphaScales` and `colorInks`, and the `MantiRadixScale`, `MantiRadixAccentScale`, `MantiRadixGrayScale`, `MantiRadixScaleEntry`, `MantiColorScale` and `MantiScaleStep` types. `colorPrimitives` now holds the `light-dark()` value of each step.

  **`@manti-ui/oklava`** picks every variant and the neutral by Radix scale name instead of a free color. Removed: `toHex`, `ACCENT_COLORS`, `NEUTRAL_HUES` and the `neutralHue` theme field. Added: `COLOR_SCALES`, `NEUTRAL_SCALES`, `scaleOf`, `scaleLabel` and the `neutral` theme field. A saved Oklava theme from an earlier version keeps its other settings, and its hex colors and neutral hue fall back to its preset's Radix scales.

- Updated dependencies [[`3ce2dd1`](https://github.com/manti-ui/ui/commit/3ce2dd1af7145d773deceb0ca44e22b1645c6520), [`d876d65`](https://github.com/manti-ui/ui/commit/d876d65e12bb71f40d25fbad57dad483875f35ac), [`565daf2`](https://github.com/manti-ui/ui/commit/565daf2ef48cfd78c73a88c1e07478842202840b), [`a194f8a`](https://github.com/manti-ui/ui/commit/a194f8a6fc0005c8c5077b5ca7f399c497518e35), [`164d1c6`](https://github.com/manti-ui/ui/commit/164d1c659a4dd09e7641e84ff24ef5e4cfacc996), [`dac2ee2`](https://github.com/manti-ui/ui/commit/dac2ee2d6a0eda7f54a21a9d866ef8e51b60192c), [`abbbfb5`](https://github.com/manti-ui/ui/commit/abbbfb54c9676c86dd1250f0a4b55f880da3d1ca), [`0a3106c`](https://github.com/manti-ui/ui/commit/0a3106c3dba00ae42f980bfc9e41039178fb1ba3), [`5c7eaac`](https://github.com/manti-ui/ui/commit/5c7eaac7d50cf19272a6e3cb316a6e92b96a83dc), [`1fd903e`](https://github.com/manti-ui/ui/commit/1fd903ebcd45c9b10cfc2a3868b8a8d91b54d21b), [`5b74ec0`](https://github.com/manti-ui/ui/commit/5b74ec00955ab078177dcba220848f4a53998689)]:
  - @manti-ui/tokens@0.14.0
  - @manti-ui/styles@0.14.0
  - @manti-ui/react@0.14.0
