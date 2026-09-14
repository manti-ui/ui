# @manti-ui/oklava

A drop-in theme devtools panel for apps built with [Manti UI](https://manti.design).

Render it in development and every Manti design token becomes live: the variant
palettes, the neutral hue, radius, font, base text size, density and focus ring,
tuned against your own screens rather than a preview canvas. Take the result away
as a `:root` CSS block, or as a brief a coding agent can act on in your repo.

```bash
pnpm add -D @manti-ui/oklava
```

```tsx
import { Oklava } from '@manti-ui/oklava';

export function App() {
  return (
    <>
      <YourApp />
      {import.meta.env.DEV && <Oklava />}
    </>
  );
}
```

No stylesheet to import: the panel writes its own chrome into the document on
mount. The package is side-effect free and single-entry, so the `DEV` branch
tree-shakes all of it out of a production build.

Every knob writes a token override, injected as one unlayered `<style>`. Manti's
defaults ship inside `@layer manti.tokens`, so an unlayered declaration wins with
no `!important`, which is the same escape hatch you would reach for by hand.

Full documentation: <https://manti.design/guides/oklava>.

## Scripts

```bash
pnpm gen:fonts   # refresh the committed Google Fonts catalogue
```

The catalogue is committed rather than fetched at runtime, so the font picker
opens without a network round trip and a host app never has to widen its CSP.
Re-run it whenever the list is worth refreshing.
