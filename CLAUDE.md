# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Manti UI is a framework-agnostic design system built on **Zag.js** behavior
machines. The driving goal is to adapt **every** Zag.js component machine into
Manti UI (tracker: `docs/zag-coverage.md`). Today only a React renderer exists;
the package layout exists so Vue/Svelte/Solid renderers can later consume the
same tokens, CSS, and machines unchanged.

## Rules (always apply)

These rules are mandatory for every agent working in this repo. The identical set
lives in `AGENTS.md` — keep the two copies byte-for-byte in sync.

1. **Keep CLAUDE.md and AGENTS.md synchronized.** Whenever `CLAUDE.md` (Claude's
   memory) is changed, mirror the same change into `AGENTS.md`, and vice versa, so
   all agents read one shared source of truth. Never let the two drift.
2. **Design tokens are mandatory.** When adapting any Zag.js component into Manti
   UI or authoring a new Manti UI component, every visual value — color, spacing,
   radius, typography, motion, elevation, z-index — must come from the design
   tokens (`@manti-ui/tokens` / token-backed `--manti-*` and `--tone-*` CSS
   variables). Never hard-code raw values (hex colors, px sizes, magic numbers);
   if a token is missing, add it to `@manti-ui/tokens` first, then consume it.
   `@manti-ui/tokens` is the single source of truth: its primitive ramps and
   scale values are **generated** into the `--manti-*` custom properties in
   `packages/styles/src/tokens.css` (the `@tokens:generated` region) by
   `pnpm gen:tokens`. Never hand-edit that region; after changing the contract,
   regenerate it — the styles build fails if it is stale. The theme-aware roles
   (`light-dark()` surfaces/text/elevation/panel) and the tonal `--tone-*`
   vocabulary below the region stay hand-authored. Tokens form three tiers:
   primitive ramps → semantic roles/tones → **component tokens**
   (`--manti-{component}-{property}`, public and semver-stable, each defaulting
   to a semantic token). When a component needs an _independent_ structural value
   (radius, padding, sizing, gap, typography), expose it as a component token
   rather than a bare literal or a private knob; keep only _derived_ `calc()`
   values as private `--_*`. Register every component token in the
   `componentTokens` map of `@manti-ui/tokens`.
3. **Match the user's language.** Always reply in the same language the user wrote
   their prompt in (e.g. Turkish prompt → Turkish answer). This applies to chat
   responses only; code, identifiers, comments, and docs stay in English.

## Commands

Node `>=22.12.0`, pnpm 10. Run from the repo root.

```bash
pnpm install          # install workspace deps
pnpm dev              # Storybook at localhost:6006 (alias of pnpm storybook)
pnpm storybook        # Storybook at localhost:6006
pnpm lint             # eslint
pnpm typecheck        # per-package tsc + stories
pnpm build            # build all packages, then Storybook (storybook-static/)
pnpm verify           # lint + typecheck + build — the required green gate
pnpm format           # prettier --write .
pnpm gen:tokens       # regenerate --manti-* CSS vars from the token contract
```

**`pnpm verify` must stay green and is the gate before any change is done.** There
is no unit-test framework yet; verification is `verify` + Storybook (use the a11y
panel and the per-story controls/variants). To build one package alone:
`pnpm --filter @manti-ui/styles build`.

## Architecture: the four-package split

A component is assembled from three separate packages plus a renderer. Respect
these boundaries — do not duplicate behavior, tokens, or styles across them.

```
@manti-ui/tokens   design-token contract (CSS custom properties, TS types)
@manti-ui/styles   all CSS, keyed to data-scope/data-part/data-state  →  depends on tokens
@manti-ui/folds    Zag.js machines + behavior contract (re-exports @zag-js/*)
@manti-ui/react    thin renderers that wire folds + styles together   →  depends on folds, styles, tokens
.storybook/        Storybook (react-vite) — the single dev surface + visual gallery
```

Dependency direction is strict: `tokens ← styles`, `folds ← react`, `styles ← react`.
Framework packages must **not** define private token values or reimplement
keyboard/focus/state logic that `folds` already owns.

### The component contract

There are two component shapes:

- **Behavioral** (Switch, Toggle, Checkbox, RadioGroup, Collapsible, Accordion,
  Tabs, Tooltip): the Zag machine owns state/keyboard/forms; the React adapter
  only renders anatomy. Pattern (see `packages/react/src/components/Switch/Switch.tsx`):
  ```tsx
  const service = useMachine(component.machine, { id: useId(), ...props });
  const api = component.connect(service, normalizeProps);
  return <el {...api.getRootProps()}>{/* parts via api.getXxxProps() */}</el>;
  ```
  Machines are imported from `@manti-ui/folds` (e.g. `switchMachine`), never from
  `@zag-js/*` directly in the renderer.
- **Static** (Button, Badge, Card, Alert, Spinner, TextField): no machine; the
  renderer emits the `data-*` anatomy attributes by hand (see `Button.tsx`).

Collection components currently take a data-driven `items` prop; promoting them to
compound APIs (`Tabs.Trigger`, …) is a planned refinement, not yet the convention.

Every public component must export typed props from
`packages/react/src/components/index.ts` (re-exported via `src/index.ts`), ship a
colocated `*.stories.tsx`, and have keyboard support, visible focus, and SR semantics.

### The styling/customization contract (public API, semver-stable)

`docs/styling.md` is the authoritative spec. Key invariants when touching CSS:

- **Anatomy attributes are public API:** `data-scope` (component), `data-part`
  (anatomy piece), `data-variant`/`data-tone`/`data-size`, and state attrs
  (`data-state`, `data-loading`, `disabled`). Class names and DOM between parts
  are private — target the data attributes.
- **All Manti CSS lives in cascade layers** declared once in
  `packages/styles/src/index.css`:
  `@layer manti.reset, manti.tokens, manti.base, manti.components, manti.motion;`
  This is deliberate — unlayered app CSS always beats layered Manti CSS without
  `!important`.
- **Tones** are CSS-variable vocabularies (`--tone-solid`, `--tone-soft-bg`, …).
  Tonal props accept any string; built-in tones keep TS autocomplete via
  `MantiTone`/`MantiBuiltinTone` from `@manti-ui/tokens`.
- **Component tokens (Tier 3)** are a public-but-secondary per-component escape
  hatch: `--manti-{component}-{property}` (e.g. `--manti-button-radius`), each
  defaulting to a Tier-2 semantic token, registered in `componentTokens` of
  `@manti-ui/tokens`. Semantic tokens (Tier 2) remain the primary theming lever;
  component tokens are for making one component diverge on purpose, not the
  everyday path. Only _independent_ dimensions are exposed; _derived_ `calc()`
  values stay private `--_*` knobs and are never API. The styles build runs
  `scripts/check-component-tokens.mjs`, which fails if the `--manti-{component}-*`
  tokens defined in a component's CSS drift from the `componentTokens` registry —
  add/rename a component token and you must update the registry too.
- `data-motion` tiers (`none`/`default`/`full`) are pure CSS in
  `packages/styles/src/motion/`.

## Build gotchas (do not regress)

The CSS theming relies on native `light-dark()` plus manual `data-theme`. The
Vite/Lightning CSS setup is tuned to preserve this — these are easy to silently break:

- **Keep the lightningcss transformer + evergreen `targets`** (chrome123 / edge123 /
  firefox120 / safari17.5). Otherwise `light-dark()` is lowered to a
  `prefers-color-scheme`-only polyfill that ignores `data-theme`.
- **`build.cssTarget` in the styles package must be the evergreen ARRAY**, not a
  single `'chrome123'`. A single chrome target makes the minifier strip the
  `-webkit-backdrop-filter` that Safari ≤17 needs for translucent surfaces.
  After a styles build, verify:
  `grep -c -- -webkit-backdrop-filter dist/index.css` > 0 and
  `grep -c prefers-color-scheme dist/index.css` == 0.
- **`@manti-ui/react` ships NO CSS side effects.** Apps import
  `@manti-ui/styles/index.css` (or `tailwind.css` / `tokens.css` /
  `tailwind-theme.css`) explicitly; Storybook does this in `.storybook/preview.tsx`.
- The Tailwind CSS entry points are emitted **verbatim** into `dist` by the
  `manti:emit-standalone-css` plugin and must not pass through Lightning CSS or
  `@theme inline` gets mangled. The react Vite config must externalize
  `/^@manti-ui\//`.

## Conventions

- Strict TypeScript, React function components. Prettier: semicolons, single
  quotes, trailing commas, two-space indent (`pnpm format` after broad edits).
- `PascalCase.tsx` components, `camelCase` functions/vars, `*.stories.tsx` stories.
- Use semantic CSS names/tokens, not raw product-specific colors. The design
  signature is sleek monochrome cool-dark panels — **no gradients, no colored
  accent**; color comes only from semantic tones.
- Conventional Commit messages (e.g. `feat(button): add loading state`). Do not
  commit `dist/`, `storybook-static/`, or cache dirs.
