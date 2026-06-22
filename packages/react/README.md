# @manti-ui/react

React adapter for **Manti UI** — a framework-agnostic design system built on
[Zag.js](https://zagjs.com) behavior machines.

## Install

```bash
npm install @manti-ui/react @manti-ui/styles
```

`@manti-ui/react` pulls in `@manti-ui/tokens` and `@manti-ui/folds` automatically.
`@manti-ui/styles` is a peer dependency — install it alongside the renderer.

## Usage

Import the stylesheet once at your app entry, then render components:

```tsx
import '@manti-ui/styles/index.css';
import { Button } from '@manti-ui/react';

export function App() {
  return (
    <Button variant="solid" tone="primary">
      Save
    </Button>
  );
}
```

Set the theme with a `data-theme="light"` / `data-theme="dark"` attribute on
`<html>` (native `light-dark()` resolves the values).

### Using with Tailwind v4

Import the bundled Tailwind entry **before** `tailwindcss`, then the full Manti
token contract drives Tailwind's standard utilities (`bg-red-500`, `rounded-lg`, …):

```css
@import '@manti-ui/styles/tailwind.css';
@import 'tailwindcss';
```

## Documentation

<https://manti.design>

## License

[MIT](https://github.com/manti-ui/ui/blob/main/LICENSE)
