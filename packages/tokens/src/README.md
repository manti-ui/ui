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
