# @manti-ui/react

React components for Manti UI.

## Install

```bash
npm install @manti-ui/react @manti-ui/styles
```

`@manti-ui/styles` is a peer dependency. Import it once:

```tsx
import '@manti-ui/styles/index.css';
import { Button } from '@manti-ui/react';

export function App() {
  return <Button variant="primary">Save</Button>;
}
```

Use `data-theme="light"` or `data-theme="dark"` on an ancestor to choose a
theme.

## Tailwind v4

```css
@import '@manti-ui/styles/tailwind.css';
@import 'tailwindcss';
```

Keep the Manti import first.

## More

- [Documentation](https://manti.design)
- [Components](https://manti.design/components)
- [Styling](https://manti.design/guides/plain-css)
- [MIT license](https://github.com/manti-ui/ui/blob/main/LICENSE)
