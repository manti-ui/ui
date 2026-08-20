# Styling

Mantı UI can be used as shipped, themed with tokens, overridden with plain CSS,
or styled headlessly with Tailwind.

## Choose a stylesheet

| Import                                | Includes                                    |
| ------------------------------------- | ------------------------------------------- |
| `@manti-ui/styles/index.css`          | Reset, tokens, base, components, and motion |
| `@manti-ui/styles/tokens.css`         | Tokens only                                 |
| `@manti-ui/styles/tailwind.css`       | Full styles plus the Tailwind v4 bridge     |
| `@manti-ui/styles/tailwind-theme.css` | Tailwind v4 bridge only                     |
| `@manti-ui/styles/themes/<id>.css`    | One shipped theme preset, on `:root`        |
| `@manti-ui/styles/themes.css`         | Every preset, scoped to `data-manti-theme`  |

`@manti-ui/react` has no CSS side effects. Import one stylesheet explicitly.

## Cascade and selectors

Mantı CSS is layered:

```css
@layer manti.reset, manti.tokens, manti.theme, manti.base, manti.components,
  manti.motion;
```

Ordinary unlayered application CSS wins over Mantı without `!important`.
Import Mantı first and application overrides second.

That also means an unlayered global reset can erase a layered component rule.
Keep native resets away from every Mantı anatomy, not only Button:

```css
button:not([data-scope][data-part]) {
  padding: 0;
}
```

For dense controls, override the component token that owns geometry:

```css
.compact-action {
  --manti-button-height: var(--app-compact-control-height);
}
```

Components expose stable anatomy attributes:

```html
<button
  data-scope="button"
  data-part="root"
  data-variant="primary"
  data-size="md"
>
  <span data-scope="button" data-part="label">Save</span>
</button>
```

Use `data-scope`, `data-part`, documented state attributes, and tokens. Do not
depend on class names, private `--_*` variables, or undocumented DOM structure.

## Theme presets

The fastest theme is one already built. Import a preset after `index.css` and
every component re-skins — variant palettes, neutral hue, radius, progress fill,
and text selection:

```css
@import '@manti-ui/styles/index.css';
@import '@manti-ui/styles/themes/ocean.css';
```

Manti ships `violet`, `ocean`, `forest`, `rose`, and `graphite`; the default
theme needs no file. They live in `@layer manti.theme`, above the token defaults
and below unlayered application CSS, so retuning one role on top of a preset
still works. For more than one theme on a page, import `themes.css` and set
`data-manti-theme` on a container.

Definitions live in `presets` in `@manti-ui/tokens`;
`packages/styles/scripts/gen-preset-css.mjs` generates the stylesheets, and the
styles build gates every preset on contrast and interaction progression.

Tune the tokens below when no preset fits, or reach for the
[Theme Studio](https://studio.manti.design) for anything custom.

## Theme with tokens

Choose the broadest token that matches the decision:

| Tier      | Example                 | Use for                             |
| --------- | ----------------------- | ----------------------------------- |
| Primitive | `--manti-orange-7`      | Replacing a raw palette or scale    |
| Semantic  | `--manti-border`        | A system-wide purpose               |
| Component | `--manti-button-radius` | One intentional component exception |

Start with semantic roles:

```css
:root {
  --manti-bg: light-dark(#fafafb, #0c0c10);
  --manti-surface: light-dark(#ffffff, #15151b);
  --manti-text: light-dark(#16161a, #f4f4f6);
  --manti-border: light-dark(#e6e6ea, #2a2a33);
  --manti-radius-factor: 0.8;
  --manti-font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
}
```

Keep theme-aware color roles in `light-dark(light, dark)` form.

Use a component token only when that component should diverge:

```css
:root {
  --manti-button-radius: var(--manti-radius-full);
}
```

The complete list is generated in
[component-tokens.md](./component-tokens.md).

## The size channel

`sm | md | lg` is one shared rhythm rather than a per-component invention: a
control and the surface it opens read at the same size. `data-size` resolves the
`--manti-size-*` channel (`packages/styles/src/size.css`), and every sizing
component token defaults to one of its values.

Popups are portalled out of their control, so nothing inherits through the DOM:
the adapter re-stamps `data-size` on the positioner, which is why a `sm` Select
opens a `sm` listbox and a `lg` Menu lays out `lg` rows.

Retune a step for the whole system:

```css
[data-size='sm'] {
  --manti-size-item-padding-y: 0.125rem;
}
```

The channel carries `text`, `text-sub`, `icon`, `control-height`,
`control-padding-x`, `control-radius`, `panel-radius`, `panel-padding`,
`panel-gap`, `item-padding-y`, `item-padding-x`, `item-gap`, `item-radius`,
and `cell`. Controls and the panels they open use the matching radius step;
row-level treatments use `item-radius` so a large menu row does not become a
pill by accident.

## Variants

Variant-driven components read the same roles:

```text
--variant-solid
--variant-solid-hover
--variant-solid-active
--variant-on-solid
--variant-soft-bg
--variant-soft-bg-hover
--variant-soft-bg-active
--variant-soft-text
--variant-border
--variant-text
--variant-ring
```

Define these roles to add a custom variant:

```css
[data-variant='brand'] {
  --variant-solid: var(--manti-blue-9);
  --variant-solid-hover: var(--manti-blue-10);
  --variant-solid-active: color-mix(in oklab, var(--manti-blue-10) 88%, black);
  --variant-on-solid: var(--manti-text-on-accent);
  --variant-soft-bg: var(--manti-blue-2);
  --variant-soft-bg-hover: var(--manti-blue-3);
  --variant-soft-bg-active: var(--manti-blue-4);
  --variant-soft-text: var(--manti-blue-9);
  --variant-border: var(--manti-blue-7);
  --variant-text: var(--manti-blue-9);
  --variant-ring: var(--manti-blue-8);
}
```

```tsx
<Button variant="brand">Save</Button>
```

Built-in names keep autocomplete. Components typed with `MantiVariant` also
accept custom strings; components with a narrower semantic union do not.

For neutral interaction states use `--manti-fill-subtle`, `--manti-fill`, and
`--manti-fill-strong`. Variant-colored equivalents are derived as
`--variant-fill` and `--variant-fill-strong`.

## Radius

Use the scale factor for system-wide roundness:

```css
:root {
  --manti-radius-factor: 1.4;
}
```

Or use a preset:

```html
<div data-radius="sharp">…</div>
```

Available values are `none`, `sharp`, `default`, `round`, and `pill`. `none` is
the square mode; the other four are positive shape profiles.

The `pill` preset makes participating controls pill-shaped. For a custom
profile, set `--manti-radius-pill: 9999px` yourself. `--manti-radius-thumb`
controls draggable handles. `--manti-radius-full` is for parts that must always
be round.

## Motion

```html
<div data-motion="none">…</div>
```

Available values are `default`, `none`, and `full`. Nested values override their
ancestor. Reduced-motion preferences override every tier.

Reusable tokens include:

```text
--manti-duration-fast | base | slow | slower
--manti-ease-smooth | soft | spring | bounce
```

## Tailwind v4

Import Mantı before Tailwind:

```css
@import '@manti-ui/styles/tailwind.css';
@import 'tailwindcss';
```

The order keeps Tailwind utilities above Mantı components:

```tsx
<Button className="rounded-none px-8">Save</Button>
```

The bridge maps Mantı tokens to standard utilities:

| Utility                         | Source                     |
| ------------------------------- | -------------------------- |
| `bg-surface`, `text-text-muted` | Semantic color roles       |
| `bg-orange-500`, `text-red-700` | Primitive ramps            |
| `bg-primary-600`                | Semantic ramp aliases      |
| `text-lg`, `font-semibold`      | Typography                 |
| `rounded-lg`                    | Radius                     |
| `p-4`, `gap-2`, `h-control-md`  | Spacing and control height |
| `ease-spring`                   | Motion                     |

For headless use, import tokens and the bridge without component CSS:

```css
@import '@manti-ui/styles/tokens.css';
@import '@manti-ui/styles/tailwind-theme.css';
@import 'tailwindcss';
```

Then style public anatomy and state attributes with utilities.

Tailwind v3 can reference `var(--manti-*)` from its config, but the `@theme`
bridge is v4-only.

## Contributor rules

When adding or changing component styles:

1. Add missing values to `@manti-ui/tokens`; do not hard-code visual values.
2. Regenerate primitive CSS with `pnpm gen:tokens`.
3. Consume semantic or `--variant-*` color roles in component CSS.
4. Follow the state progression: `3 → 4 → 5`, `6 → 7 → 8`, or `9 → 10`.
5. Register independent component dimensions in `componentTokens`.
6. Keep derived `calc()` values private as `--_*`.
7. Run the color-scale, contrast, styles build, and full verification checks.

Input-like controls use `--manti-border` at rest,
`--manti-border-strong` on hover, and `--variant-ring` when focused or open.
The primary color begins at focus/open, not at rest.

## Public API

Stable:

- stylesheet entry points and Mantı layer names;
- `--manti-*`, `--variant-*`, and documented component tokens;
- documented anatomy and state attributes;
- `data-theme`, `data-motion`, and `data-radius`.

Private:

- `--_*` variables;
- exact declarations inside a layer;
- DOM between documented anatomy parts.
