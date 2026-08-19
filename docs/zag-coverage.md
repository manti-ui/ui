# Zag.js coverage

Mantı UI adapts Zag.js machines through `@manti-ui/folds`. React renderers
connect the machine, render its public anatomy, and leave appearance to shared
CSS.

```tsx
const service = useMachine(component.machine, { id: useId(), ...props });
const api = component.connect(service, normalizeProps);
```

## Status

✅ shipped · ⬜ not implemented · 📦 built, then shelved

| Area              | Components                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Inline behavior   | ✅ Toggle, Switch, Checkbox, RadioGroup, Collapsible, Accordion, Tabs, Tooltip                                           |
| Overlays          | ✅ Dialog, Popover, HoverCard, Menu, Toast                                                                               |
| Form inputs       | ✅ NumberInput, PinInput, Slider, TagsInput, Editable, ToggleGroup                                                       |
| Selection         | ✅ Select, Combobox, Listbox, TreeView, Pagination                                                                       |
| Display and media | ✅ Avatar, Progress, RatingGroup, Carousel, Clipboard, FileUpload, SignaturePad · 📦 QrCode                              |
| Date and advanced | ✅ DatePicker, TimePicker, Steps, Tour, Splitter, ColorPicker, NavigationMenu, FloatingPanel · 📦 Timer · ⬜ AngleSlider |

## Reused machines

| Component        | Reuses     |
| ---------------- | ---------- |
| Calendar         | DatePicker |
| ContextMenu      | Menu       |
| Drawer           | Dialog     |
| SegmentedControl | RadioGroup |

## Mantı-authored behavior

- `folds/shortcut` powers `useShortcut` and `useShortcuts`.
- `folds/swipe` powers swipe-to-dismiss behavior in Toast.
- `folds/table` wraps TanStack table-core for DataTable.
- Marquee and ScrollArea do not use Zag machines.

Shelved source stays under `backlog/` and ships in no package. Read
`backlog/README.md` before re-adapting a shelved component.
