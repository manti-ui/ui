<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/manti-white.svg" />
    <img src="public/manti.svg" alt="Manti UI logo" width="180" />
  </picture>
</p>

# Mantı UI

Mantı UI is a React component library built on framework-agnostic tokens, CSS,
and behavior machines. It is named after mantı: one simple form that adapts to
many contents and contexts.

The design language is calm and compact: neutral translucent surfaces, semantic
color variants, generous radii, and motion that respects user preferences.

## Quick start

```bash
npm install @manti-ui/react @manti-ui/styles
```

Import the stylesheet once, then use any component:

```tsx
import '@manti-ui/styles/index.css';
import { Button } from '@manti-ui/react';

export function App() {
  return <Button variant="primary">Save</Button>;
}
```

Set theme, motion, or radius on `<html>` or any container:

```html
<html data-theme="dark" data-motion="default" data-radius="default">
  …
</html>
```

## Packages

| Package            | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `@manti-ui/react`  | React components and hooks                   |
| `@manti-ui/styles` | Tokens, base styles, and component CSS       |
| `@manti-ui/tokens` | Typed design-token contract                  |
| `@manti-ui/folds`  | Framework-agnostic behavior and Zag adapters |

React is the only renderer today. The lower layers are framework-agnostic so
future renderers can reuse the same behavior, anatomy, and styles.

## Documentation

- [Documentation site](https://manti.design)
- [Getting started](https://manti.design/getting-started)
- [Components](https://manti.design/components)
- [Repository docs](docs/README.md)
- [Coding-agent guide](llms.txt)

## Development

Requires Node `>=22.12.0`, pnpm `10`, and a workspace install:

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm verify
```

See [Architecture](docs/architecture.md) before changing package boundaries and
[Styling](docs/styling.md) before changing tokens or component CSS.

## License

[MIT](LICENSE)
