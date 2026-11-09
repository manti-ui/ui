# React components

Each folder contains one public renderer and a colocated Storybook story.

- Export public APIs through `../index.ts`.
- Keep behavior in `@manti-ui/folds`.
- Keep visual rules in `@manti-ui/styles`.
- Render the documented `data-scope`, `data-part`, and state attributes.
- Add the component page and metadata under `packages/docs/src/`.

## Story format

Stories are moving from Storybook to Ladle. Until the move ends, every story
file uses one shape that Ladle reads natively and Storybook reads as CSF2, so
both galleries show it. `Button/Button.stories.tsx` is the reference.

- The default export holds `title`, `args`, `argTypes` and `meta`, and
  `satisfies StoryDefault<Props>` from `@ladle/react`.
- `argTypes` use Ladle's form: `control: { type: 'select' }` (or `radio`,
  `inline-radio`, `check`, `range` and so on) plus `options`. Strings, numbers
  and booleans need no `argTypes`; Ladle infers them from `args`.
- `meta: { layout }` picks `centered`, `padded` or `fullscreen`. The global
  provider in `.ladle/components.tsx` applies it; the default is `padded`.
- Each story is a named function typed `Story<Props>` that receives the args
  as props. Attach story-level overrides as `Story.args` or `Story.argTypes`.
- Import nothing from `@storybook/*`, and write no `tags`, no `parameters` and
  no `render`. Ladle only lists a file once it no longer imports
  `@storybook/*` (`.ladle/config.mjs`).
- Theme and radius are global: Ladle's theme button and the `radius` control
  set `data-theme` and `data-radius` on the document root. Because Ladle hands
  every control to the story as a prop, a story that spreads its args onto a
  DOM element also renders a `radius` attribute there.
