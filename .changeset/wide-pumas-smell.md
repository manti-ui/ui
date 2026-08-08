---
'@manti-ui/tokens': minor
'@manti-ui/styles': minor
'@manti-ui/react': minor
---

Make a control's popup adopt the control's size.

A `sm` Select opened a listbox with `md` rows: the popup is portalled out of the
control, so `data-size` on the root never reached it, and every popup rendered at
one fixed size no matter what the trigger was set to. The same held for Combobox,
and Menu, Listbox, DatePicker, TimePicker, and ColorPicker had no `size` at all.

`sm | md | lg` is now one shared rhythm, resolved from a `--manti-size-*` channel
in `packages/styles/src/size.css`: type, supporting type, icon, control height and
padding, panel padding and gap, item padding, gap and radius, and the square cell
used by calendar and time grids. Every value derives from the spacing, type,
radius, and control-height scales, so retuning `--manti-space-1` or
`--manti-text-base` rescales popups too, and a theme can retune a single step by
redeclaring one channel variable under `[data-size='sm']`.

Each adapter re-stamps `data-size` on its positioner, so the portalled surface
resolves the same step as the control that opened it. Menu and ContextMenu gain a
`size` prop that submenus inherit; Listbox, DatePicker, TimePicker, and ColorPicker
gain one too. ColorPicker's panel is a saturation canvas with no rows to rescale,
so `size` there covers the trigger.

Every sizing value on those surfaces is now a component token defaulting to the
channel (`--manti-select-item-padding-y`, `--manti-menu-item-font-size`,
`--manti-date-picker-cell-size`, and so on), so a single component can still be
overridden on its own.

Two knock-on changes: field-backed controls (Input, Textarea) now scale their type
with `size` instead of holding at `--manti-text-sm`, so a `sm` input matches a `sm`
Select beside it, and Select's rows pick up the same horizontal padding as
Combobox, Menu, and Listbox rows.
