# Swipe — shelved

A gesture surface making any content swipeable on either axis: the content
follows the pointer and springs back on release, while `onSwipe` reports the
recognized direction.

- **Scope:** `swipe`
- **Kind:** Manti-original (no Zag machine — built on the `folds/swipe` core)
- **Shelved at:** v0.3.0
- **Component tokens:** none

> **Why shelved:** _to fill in._

## The swipe core stays — Toast depends on it

Only the **React component** is shelved. `packages/folds/src/swipe/` is untouched
and still ships, because Toast's swipe-to-dismiss is built on it:

```ts
// packages/react/src/components/Toast/Toast.tsx
import { swipe as swipeBehavior, toast } from '@manti-ui/folds';
const control = useMemo(() => swipeBehavior.createSwipe(), []);
```

Toast talks to the core directly and never rendered the `Swipe` component, so
shelving it changed nothing about Toast. The CSS is separate the same way:
`swipe.css` only ever matched `[data-scope='swipe']`, while Toast's gesture
styles live in `toast.css` under its own `&[data-swipe]` block.

**Do not "clean up" `folds/swipe` on the grounds that nothing uses it.** Toast
does, and it is the reason the core sits in `folds` rather than inside the
component.

## Files

All frozen under `backlog/swipe/`, mirroring their original paths. Restoring them
is `git mv backlog/swipe/<path> <path>` for each:

```
packages/react/src/components/Swipe/Swipe.tsx
packages/react/src/components/Swipe/Swipe.stories.tsx
packages/styles/src/components/swipe.css
packages/docs/src/content/components/swipe.mdx
packages/docs/src/data/components/swipe.ts
packages/docs/src/demos/swipe/basic.tsx
packages/docs/src/demos/swipe/dismiss.tsx
```

The docs page (`content/**/*.mdx`) and the props table (`data/components/*.ts`)
are picked up by `import.meta.glob`, so moving those two files back is enough to
re-register them. Everything below is manual.

## Re-registration checklist

No `folds` change is needed — the core never left. Each list is kept
alphabetical, so restore each line to its sorted position.

- [ ] `packages/react/src/components/index.ts` — before the `Switch` block:

  ```ts
  export { Swipe } from './Swipe/Swipe';
  export type {
    SwipeAxis,
    SwipeDetails,
    SwipeDirection,
    SwipeProps,
    SwipeVector,
  } from './Swipe/Swipe';
  ```

- [ ] `packages/styles/src/index.css` — after `marquee.css`, at the end of the
      component imports:

  ```css
  @import './components/swipe.css';
  ```

- [ ] `packages/docs/src/data/componentMeta.ts` — in `componentCatalog`, before
      the `Switch` entry:

  ```ts
  entry('Swipe', 'swipe', 'Swipe-to-act gesture surface.'),
  ```

- [ ] `docs/zag-coverage.md` — flip the Swipe row in the "Manti-original
      primitives" table from 📦 back to ✅. (The public
      `reference/zag-coverage.mdx` has no Manti-original table, so it needs no
      change.)

- [ ] `packages/docs/src/content/utilities/use-shortcut.mdx` — it used to cite
      Swipe as the sibling Manti-original primitive and linked to
      `/components/swipe`. The link was removed when that page went away; restore
      it if you want the cross-reference back.

Then `pnpm verify`, and add a changeset — re-exporting `Swipe` from
`@manti-ui/react` is a public API change.
