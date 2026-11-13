# @manti-ui/tokens

The typed, framework-agnostic source of truth for Manti UI design tokens.

It defines color ramps and roles, variants, radius, control height, spacing,
typography, elevation, motion, breakpoints, z-index, and component-token names.

After changing this contract, run:

```bash
pnpm gen:tokens
pnpm verify
```

Do not edit the generated token region in
`packages/styles/src/tokens.css` by hand.

## Contrast pairs

`contrastPairs` lists the foreground/background token pairs Manti checks its
palette on. It is also exposed as `mantiTokens.color.contrastPairs`. Manti's own
gate, `packages/styles/scripts/check-contrast.mjs`, reads this list, so an app
that themes Manti can check its own values against the same pairs.

```ts
import { contrastPairs } from '@manti-ui/tokens';

// { label: 'text / bg', fg: '--manti-text', bg: '--manti-bg',
//   kind: 'text', gate: true, scope: 'root' }
```

Each pair has these fields:

- `fg` and `bg` are the custom-property names of the foreground and the
  background.
- `kind` sets the WCAG 2.1 bar: `'text'` needs 4.5:1, and `'ui'` (borders,
  focus rings and other non-text chrome) needs 3:1.
- `gate` says whether a ratio under the bar is a failure. With `true` the
  check fails. With `false` the ratio is reported only: these are decorative
  borders and pairs whose steps Radix fixes (warning text, the focus ring, the
  ink on a solid, soft text).
- `scope` says where the pair is read. `'root'` pairs resolve at `:root`.
  `'variant'` pairs use the `--variant-*` roles, which only mean something
  inside a `[data-variant]` scope, so check them once in every variant.

The package ships data only. It does not resolve colors or compute ratios. An
app supplies its own color resolution: read each token's computed value (in the
browser with `getComputedStyle`, or from your stylesheet with a CSS color
library), in both the light and the dark scheme, then compare the two colors
against the bar `kind` names.
