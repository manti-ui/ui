# Zag.js Coverage

Primary goal: adapt **every** Zag.js component machine into Manti UI. Each adapter
keeps the renderer thin — the Zag machine (in `@manti-ui/folds`) owns behavior,
the CSS (in `@manti-ui/styles`, keyed to `data-scope`/`data-part`/`data-state`)
owns appearance, and the React component (in `@manti-ui/react`) only wires them
together with a colocated story.

## Adapter pattern

```tsx
const service = useMachine(component.machine, { id: useId(), ...props });
const api = component.connect(service, normalizeProps);
return <el {...api.getRootProps()}>{/* parts via api.getXxxProps() */}</el>;
```

Collection components (Tabs, Accordion, RadioGroup, …) currently take a data-driven
`items` prop. Promoting these to compound (`Tabs.Trigger`, …) APIs is a planned
refinement once breadth is complete.

## Status

Legend: ✅ done · ⬜ todo

### Batch 1 — inline behavior ✅

| Component   | Package               | Status |
| ----------- | --------------------- | :----: |
| Toggle      | `@zag-js/toggle`      |   ✅   |
| Switch      | `@zag-js/switch`      |   ✅   |
| Checkbox    | `@zag-js/checkbox`    |   ✅   |
| Radio Group | `@zag-js/radio-group` |   ✅   |
| Collapsible | `@zag-js/collapsible` |   ✅   |
| Accordion   | `@zag-js/accordion`   |   ✅   |
| Tabs        | `@zag-js/tabs`        |   ✅   |
| Tooltip     | `@zag-js/tooltip`     |   ✅   |

### Batch 2 — overlays & floating ✅

| Component  | Package              | Status |
| ---------- | -------------------- | :----: |
| Dialog     | `@zag-js/dialog`     |   ✅   |
| Popover    | `@zag-js/popover`    |   ✅   |
| Hover Card | `@zag-js/hover-card` |   ✅   |
| Menu       | `@zag-js/menu`       |   ✅   |
| Toast      | `@zag-js/toast`      |   ✅   |

### Batch 3 — form inputs ✅

| Component    | Package                | Status |
| ------------ | ---------------------- | :----: |
| Number Input | `@zag-js/number-input` |   ✅   |
| Pin Input    | `@zag-js/pin-input`    |   ✅   |
| Slider       | `@zag-js/slider`       |   ✅   |
| Tags Input   | `@zag-js/tags-input`   |   ✅   |
| Editable     | `@zag-js/editable`     |   ✅   |
| Toggle Group | `@zag-js/toggle-group` |   ✅   |

### Batch 4 — selection & data ✅

| Component  | Package              | Status |
| ---------- | -------------------- | :----: |
| Select     | `@zag-js/select`     |   ✅   |
| Combobox   | `@zag-js/combobox`   |   ✅   |
| Listbox    | `@zag-js/listbox`    |   ✅   |
| Tree View  | `@zag-js/tree-view`  |   ✅   |
| Pagination | `@zag-js/pagination` |   ✅   |

### Batch 5 — display & media ⬜

| Component     | Package                 | Status |
| ------------- | ----------------------- | :----: |
| Avatar        | `@zag-js/avatar`        |   ⬜   |
| Progress      | `@zag-js/progress`      |   ⬜   |
| Rating Group  | `@zag-js/rating-group`  |   ⬜   |
| Carousel      | `@zag-js/carousel`      |   ⬜   |
| QR Code       | `@zag-js/qr-code`       |   ⬜   |
| Clipboard     | `@zag-js/clipboard`     |   ⬜   |
| File Upload   | `@zag-js/file-upload`   |   ⬜   |
| Signature Pad | `@zag-js/signature-pad` |   ⬜   |

### Batch 6 — date, time & advanced ⬜

| Component       | Package                   | Status |
| --------------- | ------------------------- | :----: |
| Date Picker     | `@zag-js/date-picker`     |   ⬜   |
| Time Picker     | `@zag-js/time-picker`     |   ⬜   |
| Timer           | `@zag-js/timer`           |   ⬜   |
| Steps           | `@zag-js/steps`           |   ⬜   |
| Tour            | `@zag-js/tour`            |   ⬜   |
| Splitter        | `@zag-js/splitter`        |   ⬜   |
| Angle Slider    | `@zag-js/angle-slider`    |   ⬜   |
| Color Picker    | `@zag-js/color-picker`    |   ⬜   |
| Navigation Menu | `@zag-js/navigation-menu` |   ⬜   |
| Floating Panel  | `@zag-js/floating-panel`  |   ⬜   |

Variants that reuse a batch package: Context/Nested Menu (`menu`), Range Slider
(`slider`), Segmented Control (`radio-group`), Drawer (`dialog`), Circular vs
Linear Progress (`progress`), Date Input (`date-picker`).
