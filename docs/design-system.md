# Manti UI Design System

The first design-system release. One word drives every decision: **smooth**.

## Theming

Color tokens resolve with the CSS `light-dark()` function and follow the used
`color-scheme`. By default that means the OS preference; set `data-theme` on any
container to override it for that subtree:

```html
<div class="manti-app" data-theme="dark">…</div>
```

Apply `.manti-app` (or `body`) to pick up the themed background, text color, and
font. Import the stylesheet once at your app root —
`import '@manti-ui/styles/index.css'` — or use the Tailwind entry point;
`@manti-ui/react` deliberately ships no CSS side effects so headless usage
stays possible. See [styling.md](./styling.md) for the full customization
contract (plain CSS overrides, token theming, custom variants, Tailwind v4).

> Build note: bundlers must keep modern CSS (`light-dark()`, nesting) intact.
> The workspace Vite configs target `chrome123` for exactly this reason; a
> `prefers-color-scheme`-only polyfill would ignore manual `data-theme`.

## Motion tiers

Motion is a choice. Set `data-motion` on any container — like `data-theme` — to
pick how animated Manti is for that subtree:

```html
<div class="manti-app" data-motion="full">…</div>
```

- `default` (or unset) — the shipped transitions and keyframes.
- `none` — drop Manti's decorative motion (the spinner keeps spinning); hand the
  motion story to the host app. Your own animations inside a component survive.
- `full` — expressive, spring-driven motion built purely in CSS with the
  `--manti-ease-spring` / `--manti-ease-bounce` curves.

`prefers-reduced-motion: reduce` always wins, even over `full`. The full
contract — tokens, nesting rules, the SSR-safe story — is in
[styling.md](./styling.md#motion-tiers).

## Color

Six perceptually-uniform OKLCH ramps (`50`–`950`) from the mantı kitchen:

| Ramp     | Role    | Reference    |
| -------- | ------- | ------------ |
| `gray`   | neutral | warm neutral |
| `orange` | primary | warm orange  |
| `red`    | danger  | hot red      |
| `green`  | —       | fresh green  |
| `amber`  | —       | golden amber |
| `blue`   | —       | calm blue    |

### Semantic & variant roles

`:root` exposes surfaces and text — `--manti-bg`, `--manti-surface`,
`--manti-surface-raised`, `--manti-border`, `--manti-text`, `--manti-text-muted`,
and more.

Every variant-driven component reads a uniform vocabulary selected by
`[data-variant]`:

```
--variant-solid            --variant-soft-bg          --variant-border
--variant-solid-hover      --variant-soft-bg-hover    --variant-text
--variant-solid-active     --variant-soft-text        --variant-ring
--variant-on-solid
```

A component never hard-codes a hue; it sets `data-variant` and consumes
`--variant-*`.

## Material — sleek monochrome panel

The Manti UI signature. Surfaces are **cool, near-neutral, and monochrome** —
dark is the hero (a deep near-black with a faint cool cast), light a soft
daylight that never goes stark white. **No gradients** and no colored brand
accent: emphasis is carried by neutral light/dark (a top-lit rim, a neutral
focus ring, near-white/near-black solids), and color appears only through the
semantic variants. Floating surfaces — cards, tooltips, the field control — are a
**translucent panel**: a light `backdrop-filter: blur() saturate()`, a hairline
border, a top-lit rim catching the light, and a soft, deep shadow. This translucent
panel is the **pervasive** material: it also carries soft buttons, soft badges,
soft alerts, toggles, accordions, and collapsibles. Only **solid** fills (which
gain nothing from a blur) and the tiny form marks (checkbox, radio, switch) stay
crisp. Solid buttons invert the theme by default (near-white on dark, near-black
on light), exactly like the reference.

A subtle **ambient mesh** — three faint glows (violet, magenta, warm ember) at
very low opacity — sits behind every `.manti-app`/`body` as pure scene lighting
(not a gradient element), so the deep background reads with depth rather than
flat. The color ramps (orange, green, amber, red, blue) remain as semantic
variants for badges, alerts, and the like.

Retune the whole material from one place:

```
--manti-panel-tint          --manti-panel-border        --manti-panel-shadow
--manti-panel-tint-strong    --manti-panel-highlight      --manti-panel-shadow-color
--manti-panel-blur          --manti-ambient-1 … 3
```

Use the `.manti-panel` helper to give your own floating surfaces (menus, sheets,
command palettes) the same material. Where `backdrop-filter` is unsupported,
every panel surface falls back to an opaque token surface automatically.

## Scales

- **Radius** — `--manti-radius-xs … 2xl`, `full`. Pillowy by default.
- **Spacing** — `--manti-space-0 … 16` on a 4px grid.
- **Type** — `--manti-text-xs … 5xl`, weights `regular`–`bold`, Inter.
- **Elevation** — `--manti-shadow-sm | md | lg`, soft and warm-tinted, plus the
  layered `--manti-panel-shadow` for floating panels.
- **Motion** — `--manti-ease-smooth` (default), `--manti-ease-soft`, plus the
  expressive `--manti-ease-spring` / `--manti-ease-bounce` curves, with
  `--manti-duration-fast | base | slow | slower`. Honors
  `prefers-reduced-motion`, and is tunable per subtree via
  [motion tiers](#motion-tiers).

## Components

| Component  | Variants | Notes                                                    |
| ---------- | :------: | -------------------------------------------------------- |
| `Button`   |   all    | primary … outline across an emphasis ladder, sizes, loading |
| `Toggle`   |   all    | Zag.js toggle machine; controlled or uncontrolled        |
| `Switch`   |   all    | real checkbox + `role="switch"`, smooth thumb            |
| `Checkbox` |   all    | checked + indeterminate, drawn check                     |
| `Input`    |   all    | label, hint, error, adornments, wired ARIA               |
| `Badge`    |   all    | any variant, optional dot                                |
| `Card`     |    —     | pillowy surface; `Header`/`Title`/`Body`/`Footer`        |
| `Alert`    |   all    | dismiss, role escalates for the danger variant |
| `Spinner`  |    —     | inherits `currentColor`                                  |

## Anatomy contract

Every component renders stable attributes so the CSS is framework-agnostic:

```html
<button
  data-scope="button"
  data-part="root"
  data-variant="primary"
  data-size="md"
>
  <span data-scope="button" data-part="label">…</span>
</button>
```

A future `@manti-ui/vue` or `@manti-ui/svelte` adapter renders the same anatomy
and reuses these tokens, styles, and folds unchanged.
