# Styling & Customization

Manti UI is built to be restyled — with plain CSS, with design tokens, or with
Tailwind CSS — without specificity battles or forked components. This document
is the contract for how.

## Getting the styles

`@manti-ui/react` ships no CSS side effects. Import the stylesheet once at your
app root:

```ts
import '@manti-ui/styles/index.css';
```

Stylesheet entry points:

| Entry                                 | Contents                                               |
| ------------------------------------- | ------------------------------------------------------ |
| `@manti-ui/styles/index.css`          | Everything: reset, tokens, base, component styles      |
| `@manti-ui/styles/tokens.css`         | Token custom properties only (for headless setups)     |
| `@manti-ui/styles/tailwind.css`       | `index.css` + Tailwind v4 layer order + theme bridge   |
| `@manti-ui/styles/tailwind-theme.css` | Tailwind v4 `@theme` bridge only (for headless setups) |

## How the cascade is organized

All Manti CSS lives in cascade layers, declared once in `index.css`:

```css
@layer manti.reset, manti.tokens, manti.base, manti.components, manti.motion;
```

This is the foundation of every customization story below, because of one CSS
rule: **unlayered styles always beat layered styles**, regardless of
specificity. Any ordinary CSS you write in your app wins over Manti UI without
`!important`, without selector contests.

(`manti.motion` is declared last so the optional [motion tiers](#motion-tiers)
can override component animations by layer order alone.)

## The stable selector contract

Every component renders stable data attributes — they are public API and follow
semver:

```html
<button
  data-scope="button"
  data-part="root"
  data-variant="solid"
  data-tone="primary"
  data-size="md"
>
  <span data-scope="button" data-part="label">…</span>
</button>
```

- `data-scope` — the component (`button`, `switch`, `tabs`, …)
- `data-part` — the anatomy piece (`root`, `label`, `trigger`, `content`, …)
- `data-variant`, `data-tone`, `data-size` — the chosen props
- state attributes (`data-state`, `data-loading`, `disabled`, …) — live state

Class names and internal DOM details are _not_ part of the contract; target the
data attributes.

## Customizing with plain CSS

> Copy-paste starting points: [`examples/consumer-theme-plain-css.css`](./examples/consumer-theme-plain-css.css)
> and [`examples/consumer-theme-tailwind.css`](./examples/consumer-theme-tailwind.css)
> show a full rebrand at every altitude (primitive, semantic, component, tone).

### Override any component style

Write normal (unlayered) CSS against the anatomy contract:

```css
/* Always wins over Manti's layered styles. */
[data-scope='button'][data-part='root'] {
  border-radius: 2px;
  text-transform: uppercase;
}

[data-scope='button'][data-part='root'][data-variant='solid']:hover {
  translate: 0 -1px;
}
```

### Retheme with tokens

Tokens are CSS custom properties; redefine them at any scope. Pick the right
altitude:

```css
/* 1. Primitive ramp — rebrand the palette everywhere. */
:root {
  --manti-paprika-500: oklch(0.65 0.2 280); /* paprika is now purple */
}

/* 2. Semantic role — THE primary theming lever. Cascades to every component
      consistently (this radius change rounds buttons, cards, inputs alike). */
:root {
  --manti-radius-md: 4px;
  --manti-focus-ring: var(--manti-broth-500);
}

/* 3. Component token — escape hatch. Reach for it only to make ONE component
      diverge from the system on purpose; otherwise prefer altitude 2. */
:root {
  --manti-button-radius: 9999px; /* buttons specifically become pills */
}

/* 4. Tone — remap what a tone means, globally or per subtree. */
.marketing-section [data-tone='primary'] {
  --tone-solid: var(--manti-broth-600);
  --tone-solid-hover: var(--manti-broth-700);
}

/* 5. One instance — className or style, as usual. */
```

### Component tokens (Tier 3)

Manti tokens form three tiers, each defaulting into the one above it:

| Tier             | Example                  | Scope                            |
| ---------------- | ------------------------ | -------------------------------- |
| 1 — primitive    | `--manti-paprika-500`    | the raw palette / scales         |
| 2 — semantic     | `--manti-radius-md`, `--tone-solid` | purpose-based roles   |
| 3 — **component** | `--manti-button-radius`  | one component's structural knobs |

Component tokens are a small, curated set of `--manti-{component}-{property}`
custom properties, each defaulting to a Tier-2 semantic token.

**Theme through Tier 2 first.** Semantic tokens are the front door: a change
there cascades to every component consistently. Component tokens are a labelled
**escape hatch** — public and semver-stable, so you _may_ override them, but
reaching for them is the exception, not the everyday path. Use one only to make a
single component **intentionally diverge** from the system (e.g. pill-shaped
buttons while the rest of the UI keeps its radius):

```css
:root {
  --manti-button-radius: 9999px; /* buttons differ from cards/inputs on purpose */
}
```

If you find yourself overriding the _same_ property across many components, that
is a signal to change the Tier-2 semantic token instead — both for consistency
and to avoid the per-component sprawl this tier is deliberately kept small to
prevent.

Two rules keep this tier safe to depend on:

- **Curated, not exhaustive.** Only _independent_ dimensions a designer would
  reach for (radius, padding, sizing, gap, typography) are exposed. Color is
  already covered by the tonal `--tone-*` vocabulary, so this tier stays mostly
  structural and small.
- **Derived values stay private.** Anything a component computes from its tokens
  (`calc()` geometry like a switch thumb's size and travel) remains a private
  `--_*` knob, so you cannot put a component into an inconsistent state. The
  `--_*` variables are _not_ API — target the named component tokens instead.

The full per-component list lives in the `componentTokens` registry of
`@manti-ui/tokens` (and powers the `MantiComponentToken` autocomplete type). See
**[component-tokens.md](./component-tokens.md)** for the generated table of every
component token and its default.

### Register a custom tone

Tonal components accept any string as `tone`. Define the `--tone-*` vocabulary
for your own tone in plain CSS and pass its name:

```css
[data-tone='brand'] {
  --tone-solid: light-dark(#5536da, #7c63f0);
  --tone-solid-hover: light-dark(#4628c4, #8d77f2);
  --tone-solid-active: light-dark(#3a1fae, #9e8bf5);
  --tone-on-solid: white;
  --tone-soft-bg: light-dark(#eeeafd, #2a2350);
  --tone-soft-bg-hover: light-dark(#e0d9fb, #352b66);
  --tone-soft-text: light-dark(#4628c4, #c4b8f8);
  --tone-border: light-dark(#c4b8f8, #4a3d85);
  --tone-text: light-dark(#4628c4, #b3a3f6);
  --tone-ring: #7c63f0;
}
```

```tsx
<Button tone="brand">Ship it</Button>
```

Built-in tone names keep TypeScript autocomplete; custom strings are accepted.

## Motion tiers

Animation is opt-in-tunable through a single attribute — `data-motion` — set on
`.manti-app` or any container, exactly like `data-theme`. No config object, no
provider; it is pure CSS.

```html
<div class="manti-app" data-motion="full">…</div>
```

| Value       | Behavior                                                              |
| ----------- | -------------------------------------------------------------------- |
| _(unset)_   | Same as `default`.                                                    |
| `default`   | The shipped transitions and keyframes. The baseline look.            |
| `none`      | Disables Manti's decorative transitions/animations. The spinner's functional rotation is kept. Animations on your _own_ content nested inside a component are left untouched, so you can supply your own motion. |
| `full`      | Expressive, spring-driven motion — stronger presses, overshooting thumbs and dots, a tooltip blur-in, lifting cards with a tonal glow. |

`full` is powered by two extra curves you can also reuse directly:
`--manti-ease-spring` (gentle overshoot) and `--manti-ease-bounce` (snappier),
both authored with the CSS `linear()` function, plus `--manti-duration-slower`.

`prefers-reduced-motion: reduce` always wins, even over `full` — a user who asks
for no motion gets none regardless of the tier. Because `data-motion` is a plain
attribute it is correct on the server too: the right tier renders on first paint
with no flash.

> Mixing nested, _opposite_ tiers (e.g. a `none` subtree inside a `full`
> ancestor) is supported one level deep; on selector ties the inner tier wins.
> Deeply interleaving tiers is not a designed use case.

## Tailwind CSS v4

### Styled components + utility overrides

One import wires everything — Manti styles, the correct layer order, and the
token theme bridge:

```css
/* app.css — order matters: Manti BEFORE tailwindcss. */
@import '@manti-ui/styles/tailwind.css';
@import 'tailwindcss';
```

The packaged file pins the layer order to
`theme, base, manti, components, utilities`, which means:

- Tailwind's preflight (`base`) sits _below_ Manti styles — it can't bleach
  Manti components.
- Tailwind utilities sit _above_ Manti styles — utility classes on a Manti
  component always win:

```tsx
<Button className="rounded-none px-8 shadow-none">Sharp</Button>
```

> If `tailwindcss` is imported first, Tailwind declares its layer order before
> Manti's, and `manti` lands above `utilities` — overrides will silently stop
> working. Keep the Manti import first.

### The theme bridge

`tailwind-theme.css` maps Manti tokens to Tailwind theme variables with
`@theme inline`, so generated utilities reference the underlying
`var(--manti-*)` at runtime — they follow `light-dark()` and `data-theme`
switches for free.

| Utility example                       | Resolves to                  |
| ------------------------------------- | ---------------------------- |
| `bg-surface`, `text-text-muted`       | semantic surface/text tokens |
| `border-border`, `ring-ring`          | semantic border/focus tokens |
| `bg-paprika-500`, `text-herb-700`     | primitive ramps              |
| `bg-primary-600`, `border-danger-300` | semantic ramp aliases        |
| `rounded-manti-lg`, `shadow-manti-md` | Manti radius/elevation       |
| `h-control-md`, `min-h-control-sm`    | Manti control heights        |
| `ease-smooth`, `ease-soft`            | Manti motion curves          |
| `ease-spring`, `ease-bounce`          | Manti expressive curves      |
| `font-sans`, `font-mono`              | Manti font stacks (override) |

Spacing needs no bridge: Manti's 4px grid equals Tailwind's default
`--spacing: 0.25rem`, so `p-4` and `var(--manti-space-4)` already agree.
Radius and shadow scales are prefixed with `manti-` so Tailwind's own
`rounded-md` / `shadow-sm` keep their stock meaning. The shared control height is
exposed as `control-{sm,md,lg}` in the spacing namespace, so `h-control-md` and
friends resolve to the token and follow any override (while plain `h-10` keeps
its fixed value).

### Headless: skip Manti's CSS entirely

Don't import component styles at all; bring only the tokens (optional) and
style the anatomy with utilities. State lives in data attributes, which
Tailwind targets natively:

```css
/* app.css */
@import '@manti-ui/styles/tokens.css'; /* optional: keeps the token vocabulary */
@import '@manti-ui/styles/tailwind-theme.css'; /* optional: token-aware utilities */
@import 'tailwindcss';
```

```tsx
<Accordion.ItemTrigger className="flex w-full items-center justify-between p-4 data-[state=open]:font-semibold">
  …
  <ChevronIcon className="transition data-[state=open]:rotate-180" />
</Accordion.ItemTrigger>
```

### Tailwind v3

The override story works unchanged: v3 utilities are unlayered, and unlayered
CSS beats Manti's layers automatically. The `@theme` bridge is v4-only; in v3,
reference the custom properties from `tailwind.config` instead
(`colors: { surface: 'var(--manti-surface)' }`).

## What is public API

Stable under semver:

- token custom properties (`--manti-*`) and the `--tone-*` vocabulary
- component tokens (`--manti-{component}-*`, registered in `componentTokens`)
- the layer names (`manti.*`) and the rule that all Manti CSS is layered
- `data-scope` / `data-part` anatomy and documented state attributes
- the `data-motion` tiers (`none` / `default` / `full`)
- the stylesheet entry points listed above

Internal and free to change: `--_*` variables, exact declarations inside the
layers, and the DOM between documented parts.
