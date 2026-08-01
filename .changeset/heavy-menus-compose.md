---
'@manti-ui/react': minor
---

Make Menu and ContextMenu composable, like Card.

Both now expose the parts below the trigger as a compound API — `Menu.Trigger`,
`Menu.Content`, `Menu.Item`, `Menu.CheckboxItem`, `Menu.RadioItem`,
`Menu.Group`, `Menu.GroupLabel`, `Menu.Separator`, `Menu.ItemIcon`,
`Menu.ItemText`, `Menu.ItemShortcut`, and `Menu.ItemIndicator` — so a command
can render whatever it needs instead of the fixed
`{ value, label, icon, shortcut }` descriptor. Each command also takes its own
`onSelect`.

The `items` shorthand is unchanged and now renders through those same parts, so
existing usage keeps working. ContextMenu treats `children` as its target region
when `items` is present and as composed parts when it is omitted; it also picks
up checkbox, radio, and `tone="danger"` commands from the shared parts.
