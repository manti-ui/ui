# Backlog

Components that were built, then shelved. Their source is **frozen** here rather
than deleted, so bringing one back is a move — not a rewrite.

Nothing under `backlog/` ships. It is outside every build, `tsconfig`, ESLint,
Prettier, and Storybook glob in this repo, which is deliberate: shelved source is
a snapshot of a moment, not living code. It will drift as the packages evolve and
that is fine — it is a starting point for re-adaptation, not a maintained tree.
Nothing here is checked by `pnpm verify`.

## What is shelved

| Component | Scope     | Kind                   | Shelved at | Notes                                     |
| --------- | --------- | ---------------------- | ---------- | ----------------------------------------- |
| QrCode    | `qr-code` | Zag (`@zag-js/qr-code`) | v0.3.0     | —                                          |
| Timer     | `timer`   | Zag (`@zag-js/timer`)   | v0.3.0     | Had one component token                   |
| Swipe     | `swipe`   | Manti-original          | v0.3.0     | `folds/swipe` core stays — Toast needs it |

"Shelved at" is the last released version that shipped the component. Its public
API and the token/CSS contract it was written against are those of that release.

## Layout

Each entry mirrors the component's original repo paths, so restoring is a plain
`git mv` back with the `backlog/<name>/` prefix stripped:

```
backlog/qr-code/packages/react/src/components/QrCode/QrCode.tsx
        └─ entry ─┘└──────────── original repo path ────────────┘
```

Moving the files back is the easy half. The other half is **re-registration** —
each entry's `README.md` lists the exact lines that were removed from the shared
registries (package exports, the styles barrel, the token registry, the docs
catalog, the coverage tracker). Those are the parts a `git mv` cannot restore.

## Why not just delete it?

Git history would keep the code either way. The point of `backlog/` is
_visibility_: a deleted component is one nobody remembers existed, so the work
gets redone from scratch or the decision to drop it gets silently relitigated.
A shelved one stays browsable, and carries the reason it was shelved next to it.

This is also why `docs/zag-coverage.md` marks these 📦 rather than reverting them
to ⬜ todo. The project's goal is to adapt every Zag.js machine; ⬜ would say
"this was never done" and invite someone to redo it. 📦 says "done, then shelved
on purpose — read the backlog entry first."

## Restoring a component

1. Read `backlog/<name>/README.md` — why it was shelved, and whether that reason
   still holds.
2. `git mv` the files back to their original paths (the entry README lists them).
3. Re-add the registration lines from the entry's checklist.
4. Reconcile the snapshot with today's packages: it was frozen at the version in
   the table above, so token names, the props contract, and the folds API may
   have moved under it.
5. `pnpm verify` — the snapshot has been outside the gate the whole time it sat
   here, so this is the first check it has faced since it was shelved.
6. Re-exporting a component is a public API change: add a changeset. Note the 0.x
   `fixed`-group trap — a `minor` bump on 0.x jumps to 1.0.0, so cut 0.x minors
   with a manual version bump instead of `changeset version`.
