# Design system

Mantı UI uses one visual idea: **smooth**. Surfaces are quiet, controls are
clear, and interaction never depends on decoration alone.

## Theme

Color roles use CSS `light-dark()`. The OS preference is used by default; set
`data-theme` on any container to force a theme:

```html
<div class="manti-app" data-theme="dark">…</div>
```

Import `@manti-ui/styles/index.css` once. Apply `.manti-app` (or use `body`) for
the themed background, text, font, and ambient surface treatment.

## Color

Six OKLCH ramps run from `1` to `12`:

| Ramp     | Meaning          |
| -------- | ---------------- |
| `gray`   | neutral surfaces |
| `orange` | primary          |
| `green`  | success          |
| `blue`   | information      |
| `amber`  | warning          |
| `red`    | danger           |

Component CSS consumes semantic roles or `--variant-*`, not raw ramp stops.
Built-in variants are `primary`, `secondary`, `success`, `info`, `tertiary`,
`danger`, and `outline`. Individual components may expose a subset or add a
special treatment such as Button's `link`.

`@manti-ui/tokens` defines this exact scale contract:

| Stop | Source role                  | Purpose                          |
| ---- | ---------------------------- | -------------------------------- |
| `1`  | `appBackground[0]`           | Lighter page or panel background |
| `2`  | `appBackground[1]`           | Next page or panel background    |
| `3`  | `componentBackground.rest`   | Resting component background     |
| `4`  | `componentBackground.hover`  | Hovered component background     |
| `5`  | `componentBackground.active` | Active component background      |
| `6`  | `border.subtle`              | Subtle borders and separators    |
| `7`  | `border.interactive`         | Interactive borders              |
| `8`  | `border.strong`              | Strong borders and focus chrome  |
| `9`  | `solid.rest`                 | Resting solid fill               |
| `10` | `solid.hover`                | Hovered solid fill               |
| `11` | `text.lowContrast`           | Supporting text                  |
| `12` | `text.highContrast`          | Highest-contrast text            |

This is an intent contract, not a literal lookup table for components.
`tokens.css` maps semantic and variant roles per theme and contrast. Primary
solid uses `orange-7`; success, info, and danger use step `8`; secondary uses
`gray-11` / `gray-3` in light / dark mode; tertiary and outline use semantic
neutral values. Interactive states may use `color-mix()` instead of another raw
stop.

## Material

The default material is cool, near-neutral, and translucent. Panels share a
quiet border and blur, while surface contrast and spacing communicate hierarchy.
Use `.manti-panel` to apply the same material to application-owned surfaces.

Key controls:

```css
--manti-panel-tint
--manti-panel-tint-strong
--manti-panel-tint-pressed
--manti-panel-border
--manti-panel-blur
```

Unsupported `backdrop-filter` environments receive an opaque fallback.

## Radius

`--manti-radius-factor` rescales the radius ramp. `data-radius` provides four
presets:

```html
<div data-radius="none">…</div>
<div data-radius="sharp">…</div>
<div data-radius="default">…</div>
<div data-radius="round">…</div>
```

Set `--manti-radius-pill: 9999px` when controls should become pill-shaped.
Parts that are round by design use `--manti-radius-full`.

## Typography and spacing

- Type: `--manti-text-xs` through `--manti-text-5xl`
- Weight: `--manti-weight-regular` through `--manti-weight-bold`
- Line height: `--manti-leading-tight` through `--manti-leading-relaxed`
- Spacing: `--manti-space-0` through `--manti-space-16`, based on a 4px unit
- Control height: `--manti-control-height-sm | md | lg`

Inter is the preferred sans face but is not bundled.

## Motion

Set `data-motion` on any container:

| Value     | Result                                     |
| --------- | ------------------------------------------ |
| `default` | Standard transitions and animations        |
| `none`    | Decorative Mantı motion is removed         |
| `full`    | More expressive spring and bounce movement |

`prefers-reduced-motion: reduce` always wins. The Spinner keeps its functional
rotation.

## Tokens

Tokens have three tiers:

1. primitives and scales;
2. semantic roles and variants;
3. component tokens such as `--manti-button-radius`.

Use semantic tokens for system-wide theming. Use a component token only when one
component should intentionally differ. See [Styling](./styling.md) for examples
and [Component tokens](./component-tokens.md) for the generated reference.
