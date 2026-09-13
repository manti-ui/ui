---
'@manti-ui/tokens': patch
'@manti-ui/styles': patch
---

Steady the seams, the leading, and the radius of single-line controls.

**Select and Combobox** kept a connected popup honest by painting the shared
edge `transparent`, which let the panel behind show through as a pale line and
still reserved the border's width. Both now zero the width on the seam side
only — the trigger keeps the neutral `--manti-border` while open, the popup
drops its own seam edge, and neither paints a second line along the join. The
popup's outside corners resolve from the same clamped radius as the trigger, so
`round` and `pill` cannot produce a mismatched pair.

**Leading.** Single-line controls now share one vertical rhythm through the new
`--manti-leading-control` token, declared once in `styles/index.css` for every
control that renders one line of text. Components no longer invent their own
value: Segmented Control's item text inherits the shared leading instead of
pinning `--manti-leading-none`, and Checkbox's box is `vertical-align: middle`
so a toggle no longer re-measures the line box around it. That last one was
visible in DataTable, where checking the select-all box shortened the header row
by ~1px and shifted every body row with it.

**Radius.** `--manti-size-control-radius` steps one stop tighter than the panel
radius at `md` and `lg`, and the `round` profile's factor moves `1.4` → `1.2`;
together they stop a default-size button from reading as a pill.

**Listbox** items highlight and press on their own variant's soft ladder rather
than the neutral wash, hover and roving focus land on the same surface, and a
checked row holds the `active` rung so selection stays legible under the
keyboard. The cursor is `default`, matching a listbox rather than a link.

Also: the DatePicker trigger drops the UA button padding it was inheriting.
