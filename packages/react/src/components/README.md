# Components

Public Manti UI React components. Each component lives in its own folder with a
colocated `*.stories.tsx`, and owns only its renderer — visual styling lives in
`@manti-ui/styles`, keyed to the `data-scope` / `data-part` / `data-state`
contract, and interaction behavior comes from `@manti-ui/folds` where a Zag.js
machine applies.

Current set: `Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Spinner`,
`Switch`, `Input`, `Toggle`.

Export every public component through `../index.ts`.
