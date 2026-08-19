# Architecture

Mantı UI separates design, styling, behavior, and rendering.

## Packages

| Package            | Owns                                                     |
| ------------------ | -------------------------------------------------------- |
| `@manti-ui/tokens` | Typed primitive, semantic, variant, and component tokens |
| `@manti-ui/styles` | Layered CSS for the public component anatomy             |
| `@manti-ui/folds`  | Zag.js adapters and Mantı-authored headless behavior     |
| `@manti-ui/react`  | React components and hooks                               |

The dependency direction is one-way:

```text
tokens <- styles
folds  <- react
styles <- react (peer dependency for consumers)
```

React renderers must not duplicate tokens or behavior owned by lower layers.

## Component flow

A behavioral component follows this path:

```text
Zag machine or Mantı fold
        ↓
React adapter
        ↓
data-scope / data-part / data-state
        ↓
shared CSS and tokens
```

The React adapter imports machines through `@manti-ui/folds`, connects them with
`@zag-js/react`, and renders the returned prop getters. Static components use
the same anatomy contract without a machine.

```tsx
const service = useMachine(component.machine, { id: useId(), ...props });
const api = component.connect(service, normalizeProps);

return <div {...api.getRootProps()} />;
```

## Public contract

Stable public surfaces are:

- component props and exported types;
- documented `data-scope`, `data-part`, and state attributes;
- `--manti-*` and `--variant-*` custom properties;
- documented component tokens;
- stylesheet entry points and Mantı cascade layers.

Class names, private `--_*` variables, and DOM between documented anatomy parts
may change.

## Source map

```text
packages/tokens/src/             token contract
packages/styles/src/             shared CSS
packages/folds/src/              shared behavior
packages/react/src/components/   React renderers and stories
packages/docs/src/content/       documentation site pages
```

Each public component must export through
`packages/react/src/components/index.ts`, include a colocated Storybook story,
and have a docs page with props, anatomy, and component tokens.
