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
   tokens (`@manti-ui/tokens` / token-backed `--manti-*` and `--tone-*` CSS
   variables). Never hard-code raw values (hex colors, px sizes, magic numbers);
   if a token is missing, add it to `@manti-ui/tokens` first, then consume it.
   `@manti-ui/tokens` is the single source of truth: its primitive ramps and
   scale values are **generated** into the `--manti-*` custom properties in
   `packages/styles/src/tokens.css` (the `@tokens:generated` region) by
   `pnpm gen:tokens`. Never hand-edit that region; after changing the contract,
   regenerate it — the styles build fails if it is stale. The theme-aware roles
   (`light-dark()` surfaces/text/elevation/glass) and the tonal `--tone-*`
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

## Project Structure & Module Organization

This is a `pnpm` workspace for a framework-agnostic design system powered by
Zag.js behavior machines.

- `packages/tokens/`: shared design-token contract.
- `packages/styles/`: shared CSS and state selectors.
- `packages/folds/`: framework-agnostic Zag.js behavior.
- `packages/react/`: React renderer and Storybook stories.
- `.storybook/`: Storybook (react-vite) configuration — the single dev surface and visual gallery.
- `design/logo-explorations/`: non-production brand exploration assets.
- `docs/`: architecture and product vision.

Keep component stories beside their implementation when practical. Export
public React APIs through `packages/react/src/index.ts`.

## Build, Test, and Development Commands

Use Node `>=22.12.0` and `pnpm 10`.

```bash
pnpm install          # Install all workspace dependencies
pnpm dev              # Run Storybook at localhost:6006 (alias of pnpm storybook)
pnpm storybook        # Run Storybook at localhost:6006
pnpm build            # Build the packages and Storybook (storybook-static/)
pnpm build:storybook  # Generate storybook-static/
pnpm lint             # Run ESLint
pnpm typecheck        # Check packages and stories
pnpm verify           # Run lint, typecheck, and all production builds
pnpm gen:tokens       # Regenerate --manti-* CSS vars from the token contract
```

Run `pnpm verify` before opening a pull request.

## Coding Style & Naming Conventions

Write strict TypeScript and React function components. Prettier enforces semicolons, single quotes, trailing commas, and two-space indentation. Run `pnpm format` after broad edits.

Use:

- `PascalCase.tsx` for React components.
- `camelCase` for functions and variables.
- `*.stories.tsx` for Storybook stories.
- semantic CSS names and tokens rather than raw product-specific colors.

Keep Zag.js machines framework-agnostic and adapters thin. Public components
require typed exports, keyboard support, visible focus states, and meaningful
screen-reader semantics.

## Testing Guidelines

No unit-test framework or coverage threshold is configured yet. Every public component must include Storybook coverage for variants, disabled/error states, and meaningful interactions. Use the Storybook accessibility panel for WCAG checks and verify integration behavior through the component's stories.

When automated tests are introduced, colocate them as `ComponentName.test.tsx`.

## Commit & Pull Request Guidelines

This workspace currently has no readable Git history. Until a project convention is established, use concise Conventional Commit messages, for example `feat(button): add loading state` or `docs: clarify token naming`.

Pull requests should explain the behavioral change, list verification commands, link relevant issues, and include Storybook screenshots for visual changes. Avoid committing generated `dist/`, `storybook-static/`, or cache directories.
