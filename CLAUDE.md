# Repository Guidelines

## Rules (always apply)

These rules are mandatory for every agent working in this repo. The identical set
lives in `CLAUDE.md` — keep the two copies byte-for-byte in sync.

1. **Keep CLAUDE.md and AGENTS.md synchronized.** Whenever `CLAUDE.md` (Claude's
   memory) is changed, mirror the same change into `AGENTS.md`, and vice versa, so
   all agents read one shared source of truth. Never let the two drift.
2. **Design tokens are mandatory.** When adapting any Zag.js component into Manti
   UI or authoring a new Manti UI component, every visual value — color, spacing,
   radius, typography, motion, elevation, z-index — must come from the design
   tokens (`@manti-ui/tokens` / token-backed `--manti-*` and `--variant-*` CSS
   variables). Never hard-code raw values (hex colors, px sizes, magic numbers);
   if a token is missing, add it to `@manti-ui/tokens` first, then consume it.
   `@manti-ui/tokens` is the single source of truth. Its primitive ramps are
   the 12-step scales of `@radix-ui/colors`, taken verbatim: the neutral `gray`
   is Radix `slate`, and `tomato` (the primary), `orange`, `green`, `amber`,
   `red` and `blue` are the Radix scales of the same name. `pnpm gen:tokens`
   emits each stop as one `light-dark()` pair of Radix's light and dark step
   (`--manti-tomato-9` holds Radix `tomato9` and `tomatoDark9`), together
   with the scale values, into the `--manti-*` custom properties in `packages/styles/src/tokens.css` (the
   `@tokens:generated` region). Never hand-edit that region; after changing the
   contract, regenerate it; the styles build fails if it is stale. A theme
   names Radix scales from the `radixScales` catalog, never a free color, and
   there is no generated ramp and no neutral hue knob. The semantic roles
   (surfaces/text/panel) and the `--variant-*` vocabulary below the region stay
   hand-authored. Tokens form three tiers: primitive ramps → semantic
   roles/variants → **component tokens**
   (`--manti-{component}-{property}`, public and semver-stable, each defaulting
   to a semantic token). When a component needs an _independent_ structural value
   (radius, padding, sizing, gap, typography), expose it as a component token
   rather than a bare literal or a private knob; keep only _derived_ `calc()`
   values as private `--_*`. Register every component token in the
   `componentTokens` map of `@manti-ui/tokens`.
3. **Color-scale roles and interaction progression are mandatory.** Primitive
   ramps are ordered `1`–`12` with Radix step semantics, and a step means the
   same job in both schemes because each stop is a light/dark pair. Components
   must consume semantic roles or the `--variant-*` vocabulary rather than
   picking primitive stops directly. Use `1`–`2` for app and subtle backgrounds;
   `3` for component rest, `4` for hover and keyboard highlight, `5` for
   pressed/selected/checked; `6` for quiet chrome and separators, `7` for
   interactive borders and low-emphasis controls, `8` for strong interactive
   chrome and the variant focus ring (`--variant-ring`); `9` for solid fills,
   `10` for solid hover; `11` for supporting text and `12` for high-contrast
   text. Roles follow the Radix steps exactly, with no off-step exceptions:
   the neutral `--manti-focus-ring` is `gray-8`, warning text and every
   variant's `--variant-soft-text` are step `11`, and `--manti-text-subtle`
   shares step `11` with `--manti-text-muted` (Radix has one low-contrast text
   step). Labels on a solid fill use the fixed inks (`--manti-ink-light` /
   `--manti-ink-dark`, consumed as `--manti-text-on-accent` /
   `--manti-text-on-bright`), never a scale step, picked by Radix's step 9
   rule: the light ink on every scale except Sky, Mint, Lime, Yellow and
   Amber, which take the dark ink (`radixInk` in `@manti-ui/tokens`). The
   contrast check reports these Radix-fixed pairs and does not gate them.
   Input-like controls (including Input, Textarea, Select, Combobox,
   NumberInput, PinInput, TagsInput, Editable, DatePicker, TimePicker,
   ColorPicker, and Clipboard) use
   `--manti-border` at rest, strengthen to the neutral
   `--manti-border-strong` on hover, and use `--variant-ring` while active,
   focused, or open. The primary color must begin at active/focus/open for this
   control family; never use a variant color for its resting or hover border.
   Select and Combobox are the deliberate open-state exception: a connected
   trigger and its popup are one surface with one outline, so the trigger keeps
   the neutral `--manti-border` while open instead of taking `--variant-ring`,
   and only the edge it shares with the popup is dropped. Zero the width on
   that seam side alone and tint it to the panel, so neither element paints a
   second line along the join; the popup does the same on its own seam edge.
   Which edge is the seam depends on `data-side`, so never zero a border width
   unconditionally on open.
   Semantic mappings must be theme-aware: interaction strength increases in the
   direction that gains contrast in each theme.
   Filled and selected surfaces follow rest `3` → hover `4` → active `5`; solid
   controls follow `9` → `10`. Define these mappings centrally in
   `packages/styles/src/tokens.css`, consume only semantic/variant roles in
   component CSS, and verify changes with `pnpm check:color-scale`,
   `pnpm --filter @manti-ui/styles check:contrast`, and the styles build.
4. **Size travels with the surface a control opens.** `sm | md | lg` is one
   shared rhythm, resolved from the `--manti-size-*` channel in
   `packages/styles/src/size.css`; component tokens default to it rather than to
   bare values. A popup is portalled out of its control, so the adapter must
   re-stamp `data-size` on the positioner: a `sm` Select opens a `sm` listbox, a
   `lg` Menu lays out `lg` rows. Never let a sized control open a fixed-size
   surface, and never open the channel on a component that spends `data-size` on
   something else (Dialog width, Avatar diameter, DataTable density).
5. **Typography flows through Text and Heading.** The shared type scale is the
   token set in `@manti-ui/tokens` (`--manti-text-*`, `--manti-weight-*`,
   `--manti-leading-*`, `--manti-tracking-*`), rendered by the `Text` and
   `Heading` components. In stories, demos, docs pages, and every other
   authored surface, never write a raw `<h1>`-`<h6>` or `<p>`; render copy
   with `Heading`/`Text` (the polymorphic `as` prop covers spans, labels, and
   other elements). Inside a component adapter, an element that is an anatomy
   part (it carries the machine's `data-scope`/`data-part`, like Dialog's
   title) must stay a native element, because `Text`/`Heading` stamp their own
   `data-scope`/`data-part` and spend `data-size` on the type scale, which
   collides with the part-override contract and the size channel of rule 4.
   Such parts instead compose their look in CSS strictly from the typography
   tokens above: no raw font sizes, weights, line heights, or letter spacings
   anywhere in component CSS. When a needed stop is missing, extend the
   contract in `@manti-ui/tokens` (then run `pnpm gen:tokens`) instead of
   hard-coding a value.
6. **Never use box shadows.** `box-shadow` is prohibited everywhere in Manti UI,
   including components, utilities, documentation surfaces, examples, motion
   states, and focus treatments. Do not add shadow tokens or shadow-based
   elevation. Communicate hierarchy with surface contrast, borders, spacing,
   and layering instead; use an outline only when it conveys a real boundary,
   focus state, or functional mask rather than simulated elevation.
7. **Match the user's language.** Always reply in the same language the user wrote
   their prompt in (e.g. Turkish prompt → Turkish answer). This applies to chat
   responses only; code, identifiers, comments, and docs stay in English.

## Project Structure & Module Organization

This is a `pnpm` workspace for a framework-agnostic design system powered by
Zag.js behavior machines.

- `packages/tokens/`: shared design-token contract.
- `packages/styles/`: shared CSS and state selectors.
- `packages/folds/`: framework-agnostic Zag.js behavior.
- `packages/react/`: React renderer and Ladle stories.
- `packages/oklava/`: the drop-in theme devtools panel.
- `.ladle/`: Ladle configuration — the single dev surface and visual gallery.
- `design/logo-explorations/`: non-production brand exploration assets.
- `docs/`: architecture and product vision.

Keep component stories beside their implementation when practical. Export
public React APIs through `packages/react/src/index.ts`.

## Build, Test, and Development Commands

Use Node `>=22.12.0` and `pnpm 10`.

```bash
pnpm install          # Install all workspace dependencies
pnpm dev              # build packages, then run Ladle at localhost:61000/ladle/
pnpm ladle            # Run Ladle only, no rebuild (use after a pnpm dev build)
pnpm build            # Build the packages and Ladle (ladle-static/)
pnpm build:ladle      # Generate ladle-static/
pnpm build:site       # Build the docs site with Ladle copied under dist/ladle
pnpm lint             # Run ESLint
pnpm typecheck        # Check packages and stories
pnpm check:types      # After a package build, type check a consumer under NodeNext and Bundler
pnpm verify           # Run lint, typecheck, all production builds, and check:types
pnpm gen:tokens       # Regenerate --manti-* CSS vars from the token contract
pnpm gen:presets      # Regenerate the shipped theme presets in styles/src/themes
```

Run `pnpm verify` before opening a pull request.

## Coding Style & Naming Conventions

Write strict TypeScript and React function components. Prettier enforces semicolons, single quotes, trailing commas, and two-space indentation. Run `pnpm format` after broad edits.

Use:

- `PascalCase.tsx` for React components.
- `camelCase` for functions and variables.
- `*.stories.tsx` for Ladle stories, in the format set by
  `packages/react/src/components/README.md`.
- semantic CSS names and tokens rather than raw product-specific colors.
- full relative import paths ending in `.js` (`./meta.js`,
  `./components/index.js`), never an extensionless path or a bare folder. The
  emitted `.d.ts` files keep these paths, and a consumer on `NodeNext`
  resolution cannot follow anything shorter.

Keep Zag.js machines framework-agnostic and adapters thin. Public components
require typed exports, keyboard support, visible focus states, and meaningful
screen-reader semantics.

## Testing Guidelines

No unit-test framework or coverage threshold is configured yet. Every public component must include Ladle story coverage for variants, disabled/error states, and meaningful interactions. Use Ladle's a11y (axe) panel for WCAG checks and verify integration behavior through the component's stories.

When automated tests are introduced, colocate them as `ComponentName.test.tsx`.

## The backlog

`backlog/` holds frozen source for components that were built, then shelved
(QrCode, Timer, Swipe). Each entry mirrors the component's original repo paths
and carries a `README.md` with the reason plus a re-registration checklist. It is
outside every build, tsconfig, ESLint, Prettier, and Ladle glob — nothing
there is checked by `pnpm verify`, and it is expected to drift. `docs/zag-coverage.md`
marks these 📦 (done, then shelved), never ⬜ (todo). Read `backlog/README.md`
before re-adapting any of them, and shelve rather than delete a component.

A shelved component does **not** mean its behavior is unused: `folds/swipe` still
ships because Toast's swipe-to-dismiss is built on the core directly. Do not
remove a `folds` primitive on the grounds that no component renders it — check
consumers first.

## Commit & Pull Request Guidelines

This workspace currently has no readable Git history. Until a project convention is established, use concise Conventional Commit messages, for example `feat(button): add loading state` or `docs: clarify token naming`.

Pull requests should explain the behavioral change, list verification commands, link relevant issues, and include Ladle screenshots for visual changes. Avoid committing generated `dist/`, `ladle-static/`, or cache directories.
