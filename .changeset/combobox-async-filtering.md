---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
'@manti-ui/react': patch
---

`Combobox` can back a remote search. New props: `inputValue`, `defaultInputValue` and `onInputValueChange` control the typed text; `filter={false}` renders `items` as given, and a `filter` function replaces the built-in label match; `loading` shows a spinner row announced through `role="status"`; `emptyContent` fills the open listbox when it has no rows; `minChars` keeps the listbox closed until the query is long enough. A pick now survives an `items` update that no longer holds it, and multi-select chips keep their labels. The popup joins the control's seam when it shows only the loading or empty row. Without the new props, behavior is unchanged.

New `loading` and `empty` anatomy parts, and three registered component tokens: `--manti-combobox-status-padding-y`, `--manti-combobox-status-padding-x` and `--manti-combobox-status-gap`.
