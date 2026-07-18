# Timer — shelved

A count-up / count-down timer backed by the Zag.js `timer` machine. `parts`
chooses which segments to show; start / pause / reset buttons are opt-in.

- **Scope:** `timer`
- **Kind:** Zag adapter (`@zag-js/timer@^1.41.2`)
- **Shelved at:** v0.3.0
- **Component tokens:** `--manti-timer-item-min-width` (`3.5rem`)

> **Why shelved:** _to fill in._

## Files

All frozen under `backlog/timer/`, mirroring their original paths. Restoring them
is `git mv backlog/timer/<path> <path>` for each:

```
packages/react/src/components/Timer/Timer.tsx
packages/react/src/components/Timer/Timer.stories.tsx
packages/styles/src/components/timer.css
packages/docs/src/content/components/timer.mdx
packages/docs/src/data/components/timer.ts
packages/docs/src/demos/timer/basic.tsx
packages/docs/src/demos/timer/countdown.tsx
```

The docs page (`content/**/*.mdx`) and the props table (`data/components/*.ts`)
are picked up by `import.meta.glob`, so moving those two files back is enough to
re-register them. Everything below is manual.

## Re-registration checklist

These lines were removed from shared files and must go back. Each list is kept
alphabetical — restore each line to its sorted position.

- [ ] `packages/react/src/components/index.ts` — before the `TreeView` block:

  ```ts
  export { Timer } from './Timer/Timer';
  export type { TimerProps } from './Timer/Timer';
  ```

- [ ] `packages/styles/src/index.css` — after `time-picker.css`:

  ```css
  @import './components/timer.css';
  ```

- [ ] `packages/tokens/src/index.ts` — in `componentTokens`, after
      `'time-picker'`:

  ```ts
  timer: ['item-min-width'],
  ```

  **This one is load-bearing.** `scripts/check-component-tokens.mjs` fails the
  styles build on drift in either direction, so `timer.css` and this entry must
  come back together — restoring the CSS without the registry entry breaks the
  build, and vice versa.

- [ ] `docs/component-tokens.md` — restore the row:

  ```
  | `timer`             | `--manti-timer-item-min-width`              | `3.5rem`                         |
  ```

- [ ] `packages/folds/src/index.ts` — after the `timePicker` export:

  ```ts
  export * as timer from '@zag-js/timer';
  ```

- [ ] `packages/folds/package.json` — under `dependencies`:

  ```json
  "@zag-js/timer": "^1.41.2",
  ```

  then `pnpm install`.

- [ ] `packages/docs/src/data/componentMeta.ts` — in `componentCatalog`, before
      the `Toast` entry:

  ```ts
  entry('Timer', 'timer', 'Countdown / count-up timer.'),
  ```

- [ ] `docs/zag-coverage.md` and
      `packages/docs/src/content/reference/zag-coverage.mdx` — flip the Timer row
      from 📦 back to ✅.

Then `pnpm verify`, and add a changeset — re-exporting `Timer` from
`@manti-ui/react` and re-adding `--manti-timer-item-min-width` to the token
contract are both public API changes.
