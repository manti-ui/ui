# React components

Each folder contains one public renderer and a colocated Ladle story.

- Export public APIs through `../index.ts`.
- Keep behavior in `@manti-ui/folds`.
- Keep visual rules in `@manti-ui/styles`.
- Render the documented `data-scope`, `data-part`, and state attributes.
- Add the component page and metadata under `packages/docs/src/`.

## Story format

Every story file uses Ladle's native format. `Button/Button.stories.tsx` is
the reference.

- The default export holds `title`, `args`, `argTypes` and `meta`, and
  `satisfies StoryDefault<Props>` from `@ladle/react`.
- `argTypes` use Ladle's form: `control: { type: 'select' }` (or `radio`,
  `inline-radio`, `check`, `range` and so on) plus `options`. Strings, numbers
  and booleans need no `argTypes`; Ladle infers them from `args`.
- `meta: { layout }` picks `centered`, `padded` or `fullscreen`. The global
  provider in `.ladle/components.tsx` applies it; the default is `padded`.
- Each story is a named function typed `Story<Props>` that receives the args
  as props. Attach story-level overrides as `Story.args` or `Story.argTypes`.
- Write no `tags`, no `parameters` and no `render`: Ladle has none of them.
- Theme and radius are global: Ladle's theme button and the `radius` control
  set `data-theme` and `data-radius` on the document root. Because Ladle hands
  every control to the story as a prop, a story that spreads its args onto a
  DOM element also renders a `radius` attribute there.
