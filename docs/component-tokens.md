# Component tokens

This table is generated from `@manti-ui/tokens` and component CSS. Do not edit
the generated region. Run:

```bash
pnpm --filter @manti-ui/styles gen:component-tokens-doc
```

Component tokens are public per-component overrides. Prefer semantic tokens for
system-wide changes; use this list when one component should differ. See
[Styling](./styling.md#theme-with-tokens).

<!-- @component-tokens:generated:start -->

| Component           | Token                                       | Default                                                              |
| ------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `accordion`         | `--manti-accordion-radius`                  | `var(--manti-radius-lg)`                                             |
| `accordion`         | `--manti-accordion-padding-x`               | `var(--manti-space-3)`                                               |
| `accordion`         | `--manti-accordion-padding-y`               | `var(--manti-space-2)`                                               |
| `accordion`         | `--manti-accordion-gap`                     | `var(--manti-space-3)`                                               |
| `alert`             | `--manti-alert-radius`                      | `var(--manti-radius-lg)`                                             |
| `alert`             | `--manti-alert-padding-x`                   | `var(--manti-space-4)`                                               |
| `alert`             | `--manti-alert-padding-y`                   | `var(--manti-space-4)`                                               |
| `alert`             | `--manti-alert-gap`                         | `var(--manti-space-3)`                                               |
| `alert`             | `--manti-alert-icon-size`                   | `1.25rem`                                                            |
| `alert`             | `--manti-alert-dismiss-size`                | `1.5rem`                                                             |
| `alert`             | `--manti-alert-font-size`                   | `var(--manti-text-sm)`                                               |
| `avatar`            | `--manti-avatar-size`                       | `2.5rem`                                                             |
| `avatar`            | `--manti-avatar-radius`                     | `var(--manti-radius-full)`                                           |
| `badge`             | `--manti-badge-radius`                      | `var(--manti-radius-full)`                                           |
| `badge`             | `--manti-badge-font-size`                   | `var(--manti-text-xs)`                                               |
| `badge`             | `--manti-badge-padding-y`                   | `0.125rem`                                                           |
| `badge`             | `--manti-badge-padding-x`                   | `var(--manti-space-2)`                                               |
| `badge`             | `--manti-badge-gap`                         | `var(--manti-space-1)`                                               |
| `badge`             | `--manti-badge-dot-size`                    | `0.5em`                                                              |
| `blockquote`        | `--manti-blockquote-accent-width`           | `var(--manti-focus-ring-width)`                                      |
| `blockquote`        | `--manti-blockquote-padding-x`              | `var(--manti-space-4)`                                               |
| `blockquote`        | `--manti-blockquote-font-size`              | `var(--manti-text-base)`                                             |
| `button`            | `--manti-button-radius`                     | `max(var(--_radius-base), var(--manti-radius-pill))`                 |
| `button`            | `--manti-button-height`                     | `var(--manti-control-height-md)`                                     |
| `button`            | `--manti-button-padding-x`                  | `var(--manti-space-3)`                                               |
| `button`            | `--manti-button-font-size`                  | `var(--manti-text-sm)`                                               |
| `button`            | `--manti-button-gap`                        | `var(--manti-space-2)`                                               |
| `button`            | `--manti-button-cursor`                     | `default`                                                            |
| `button`            | `--manti-button-bg-hover`                   | `var(--variant-fill)`                                                |
| `button`            | `--manti-button-bg-active`                  | `var(--variant-fill-strong)`                                         |
| `calendar`          | `--manti-calendar-day-min-height`           | `5.5rem`                                                             |
| `calendar`          | `--manti-calendar-day-padding`              | `var(--manti-space-2)`                                               |
| `calendar`          | `--manti-calendar-radius`                   | `var(--manti-radius-md)`                                             |
| `card`              | `--manti-card-radius`                       | `var(--manti-radius-xl)`                                             |
| `card`              | `--manti-card-padding-x`                    | `var(--manti-space-6)`                                               |
| `card`              | `--manti-card-padding-y`                    | `var(--manti-space-6)`                                               |
| `carousel`          | `--manti-carousel-slide-gap`                | `var(--manti-space-3)`                                               |
| `carousel`          | `--manti-carousel-gap`                      | `var(--manti-space-3)`                                               |
| `carousel`          | `--manti-carousel-radius`                   | `var(--manti-radius-lg)`                                             |
| `carousel`          | `--manti-carousel-trigger-size`             | `2.25rem`                                                            |
| `carousel`          | `--manti-carousel-indicator-size`           | `0.5rem`                                                             |
| `carousel`          | `--manti-carousel-viewport-height`          | `22rem`                                                              |
| `checkbox`          | `--manti-checkbox-size`                     | `1.25rem`                                                            |
| `checkbox`          | `--manti-checkbox-radius`                   | `var(--manti-radius-sm)`                                             |
| `checkbox`          | `--manti-checkbox-gap`                      | `var(--manti-space-3)`                                               |
| `checkbox`          | `--manti-checkbox-font-size`                | `var(--manti-text-sm)`                                               |
| `checkbox`          | `--manti-checkbox-indicator-size`           | `80%`                                                                |
| `clipboard`         | `--manti-clipboard-height`                  | `var(--manti-control-height-md)`                                     |
| `clipboard`         | `--manti-clipboard-radius`                  | `var(--manti-radius-md)`                                             |
| `clipboard`         | `--manti-clipboard-padding-x`               | `var(--manti-space-3)`                                               |
| `clipboard`         | `--manti-clipboard-gap`                     | `var(--manti-space-2)`                                               |
| `clipboard`         | `--manti-clipboard-font-size`               | `var(--manti-text-sm)`                                               |
| `clipboard`         | `--manti-clipboard-trigger-width`           | `2.5rem`                                                             |
| `code`              | `--manti-code-radius`                       | `var(--manti-radius-xs)`                                             |
| `code`              | `--manti-code-padding-x`                    | `var(--manti-space-1)`                                               |
| `code`              | `--manti-code-padding-y`                    | `calc(var(--manti-space-1) / 2)`                                     |
| `code`              | `--manti-code-font-size`                    | `var(--manti-text-sm)`                                               |
| `collapsible`       | `--manti-collapsible-radius`                | `var(--manti-radius-md)`                                             |
| `collapsible`       | `--manti-collapsible-padding-x`             | `var(--manti-space-3)`                                               |
| `collapsible`       | `--manti-collapsible-padding-y`             | `var(--manti-space-2)`                                               |
| `collapsible`       | `--manti-collapsible-gap`                   | `var(--manti-space-2)`                                               |
| `collapsible`       | `--manti-collapsible-icon-size`             | `var(--manti-space-5)`                                               |
| `color-picker`      | `--manti-color-picker-height`               | `var( --manti-size-control-height, var(--manti-control-height-md) )` |
| `color-picker`      | `--manti-color-picker-padding-x`            | `var( --manti-size-control-padding-x, var(--manti-space-3) )`        |
| `color-picker`      | `--manti-color-picker-swatch-size`          | `calc( var(--manti-color-picker-height) * 0.68 )`                    |
| `color-picker`      | `--manti-color-picker-panel-width`          | `16rem`                                                              |
| `color-picker`      | `--manti-color-picker-area-height`          | `9rem`                                                               |
| `combobox`          | `--manti-combobox-height`                   | `var( --manti-size-control-height, var(--manti-control-height-md) )` |
| `combobox`          | `--manti-combobox-padding-x`                | `var( --manti-size-control-padding-x, var(--manti-space-3) )`        |
| `combobox`          | `--manti-combobox-icon-size`                | `var(--manti-size-icon, var(--manti-text-base))`                     |
| `combobox`          | `--manti-combobox-content-max-height`       | `18rem`                                                              |
| `combobox`          | `--manti-combobox-content-padding`          | `var( --manti-size-panel-padding, var(--manti-space-2) )`            |
| `combobox`          | `--manti-combobox-content-gap`              | `var( --manti-size-panel-gap, var(--manti-space-1) )`                |
| `combobox`          | `--manti-combobox-item-padding-y`           | `var( --manti-size-item-padding-y, var(--manti-space-2) )`           |
| `combobox`          | `--manti-combobox-item-padding-x`           | `var( --manti-size-item-padding-x, var(--manti-space-3) )`           |
| `combobox`          | `--manti-combobox-item-gap`                 | `var(--manti-size-item-gap, var(--manti-space-2))`                   |
| `combobox`          | `--manti-combobox-item-radius`              | `var( --manti-size-item-radius, var(--manti-radius-sm) )`            |
| `combobox`          | `--manti-combobox-item-font-size`           | `var( --manti-size-text, var(--manti-text-sm) )`                     |
| `data-table`        | `--manti-data-table-radius`                 | `var(--manti-radius-lg)`                                             |
| `data-table`        | `--manti-data-table-cell-padding-x`         | `var(--manti-space-4)`                                               |
| `data-table`        | `--manti-data-table-cell-padding-y`         | `var(--manti-space-3)`                                               |
| `data-table`        | `--manti-data-table-font-size`              | `var(--manti-text-sm)`                                               |
| `data-table`        | `--manti-data-table-header-font-size`       | `var(--manti-text-xs)`                                               |
| `date-picker`       | `--manti-date-picker-height`                | `var( --manti-size-control-height, var(--manti-control-height-md) )` |
| `date-picker`       | `--manti-date-picker-padding-x`             | `var( --manti-size-control-padding-x, var(--manti-space-3) )`        |
| `date-picker`       | `--manti-date-picker-content-padding`       | `var( --manti-size-panel-padding, var(--manti-space-2) )`            |
| `date-picker`       | `--manti-date-picker-cell-size`             | `var( --manti-size-cell, var(--manti-control-height-md) )`           |
| `date-picker`       | `--manti-date-picker-nav-size`              | `calc( var(--manti-date-picker-cell-size) - var(--manti-space-1) )`  |
| `dialog`            | `--manti-dialog-max-width`                  | `32rem`                                                              |
| `dialog`            | `--manti-dialog-radius`                     | `var(--manti-radius-lg)`                                             |
| `dialog`            | `--manti-dialog-padding-x`                  | `var(--manti-space-6)`                                               |
| `dialog`            | `--manti-dialog-padding-y`                  | `var(--manti-space-6)`                                               |
| `dialog`            | `--manti-dialog-gap`                        | `var(--manti-space-3)`                                               |
| `dialog`            | `--manti-dialog-z-index`                    | `var(--manti-z-overlay)`                                             |
| `drawer`            | `--manti-drawer-size`                       | `24rem`                                                              |
| `editable`          | `--manti-editable-height`                   | `var(--manti-control-height-md)`                                     |
| `field`             | `--manti-field-height`                      | `var( --manti-size-control-height, var(--manti-control-height-md) )` |
| `field`             | `--manti-field-padding-x`                   | `var( --manti-size-control-padding-x, var(--manti-space-3) )`        |
| `field`             | `--manti-field-padding-y`                   | `var( --manti-size-item-padding-y, var(--manti-space-2) )`           |
| `field`             | `--manti-field-font-size`                   | `var(--manti-size-text, var(--manti-text-sm))`                       |
| `field`             | `--manti-field-addon-padding-x`             | `var(--manti-space-1)`                                               |
| `floating-panel`    | `--manti-floating-panel-min-width`          | `16rem`                                                              |
| `floating-panel`    | `--manti-floating-panel-min-height`         | `8rem`                                                               |
| `heading`           | `--manti-heading-font-size`                 | `var(--manti-text-2xl)`                                              |
| `heading`           | `--manti-heading-line-height`               | `var(--manti-leading-tight)`                                         |
| `heading`           | `--manti-heading-weight`                    | `var(--manti-weight-semibold)`                                       |
| `heading`           | `--manti-heading-tracking`                  | `var(--manti-tracking-tight)`                                        |
| `hover-card`        | `--manti-hover-card-max-width`              | `20rem`                                                              |
| `kbd`               | `--manti-kbd-radius`                        | `var(--manti-radius-sm)`                                             |
| `kbd`               | `--manti-kbd-padding-x`                     | `var(--manti-space-2)`                                               |
| `kbd`               | `--manti-kbd-padding-y`                     | `var(--manti-space-1)`                                               |
| `kbd`               | `--manti-kbd-font-size`                     | `var(--manti-text-xs)`                                               |
| `kbd`               | `--manti-kbd-border-width`                  | `calc(var(--manti-focus-ring-offset) / 2)`                           |
| `listbox`           | `--manti-listbox-min-width`                 | `14rem`                                                              |
| `listbox`           | `--manti-listbox-max-height`                | `18rem`                                                              |
| `listbox`           | `--manti-listbox-padding`                   | `var( --manti-size-panel-padding, var(--manti-space-2) )`            |
| `listbox`           | `--manti-listbox-gap`                       | `var(--manti-size-panel-gap, var(--manti-space-1))`                  |
| `listbox`           | `--manti-listbox-item-padding-y`            | `var( --manti-size-item-padding-y, var(--manti-space-2) )`           |
| `listbox`           | `--manti-listbox-item-padding-x`            | `var( --manti-size-item-padding-x, var(--manti-space-3) )`           |
| `listbox`           | `--manti-listbox-item-gap`                  | `var(--manti-size-item-gap, var(--manti-space-2))`                   |
| `listbox`           | `--manti-listbox-item-radius`               | `var( --manti-size-item-radius, var(--manti-radius-sm) )`            |
| `listbox`           | `--manti-listbox-item-font-size`            | `var( --manti-size-text, var(--manti-text-sm) )`                     |
| `marquee`           | `--manti-marquee-gap`                       | `var(--manti-space-8)`                                               |
| `marquee`           | `--manti-marquee-duration`                  | `20s`                                                                |
| `menu`              | `--manti-menu-min-width`                    | `12rem`                                                              |
| `menu`              | `--manti-menu-max-width`                    | `20rem`                                                              |
| `menu`              | `--manti-menu-padding`                      | `var(--manti-size-panel-padding, var(--manti-space-2))`              |
| `menu`              | `--manti-menu-gap`                          | `var(--manti-size-panel-gap, var(--manti-space-1))`                  |
| `menu`              | `--manti-menu-item-padding-y`               | `var( --manti-size-item-padding-y, var(--manti-space-2) )`           |
| `menu`              | `--manti-menu-item-padding-x`               | `var( --manti-size-item-padding-x, var(--manti-space-3) )`           |
| `menu`              | `--manti-menu-item-gap`                     | `var(--manti-size-item-gap, var(--manti-space-2))`                   |
| `menu`              | `--manti-menu-item-radius`                  | `var( --manti-size-item-radius, var(--manti-radius-sm) )`            |
| `menu`              | `--manti-menu-item-font-size`               | `var(--manti-size-text, var(--manti-text-sm))`                       |
| `menu`              | `--manti-menu-submenu-min-width`            | `10rem`                                                              |
| `menu`              | `--manti-menu-submenu-indicator-size`       | `var( --manti-size-icon, var(--manti-space-4) )`                     |
| `menu`              | `--manti-menu-submenu-offset`               | `var(--manti-space-3)`                                               |
| `menu`              | `--manti-menu-motion-offset`                | `calc(var(--manti-space-1) / 2)`                                     |
| `menu`              | `--manti-menu-z-index`                      | `var(--manti-z-popover)`                                             |
| `navigation-menu`   | `--manti-navigation-menu-content-min-width` | `16rem`                                                              |
| `number-input`      | `--manti-number-input-height`               | `var(--manti-control-height-md)`                                     |
| `number-input`      | `--manti-number-input-stepper-width`        | `2.25rem`                                                            |
| `pagination`        | `--manti-pagination-size`                   | `2.25rem`                                                            |
| `pin-input`         | `--manti-pin-input-size`                    | `2.75rem`                                                            |
| `popover`           | `--manti-popover-max-width`                 | `20rem`                                                              |
| `popover`           | `--manti-popover-z-index`                   | `var(--manti-z-popover)`                                             |
| `progress`          | `--manti-progress-track-height`             | `0.5rem`                                                             |
| `progress`          | `--manti-progress-circle-size`              | `5rem`                                                               |
| `progress`          | `--manti-progress-circle-thickness`         | `var(--manti-space-2)`                                               |
| `rating-group`      | `--manti-rating-group-size`                 | `1.5rem`                                                             |
| `scroll-area`       | `--manti-scroll-area-size`                  | `var(--manti-space-2)`                                               |
| `segmented-control` | `--manti-segmented-control-height`          | `2rem`                                                               |
| `segmented-control` | `--manti-segmented-control-padding-x`       | `var(--manti-space-3)`                                               |
| `select`            | `--manti-select-height`                     | `var( --manti-size-control-height, var(--manti-control-height-md) )` |
| `select`            | `--manti-select-padding-x`                  | `var( --manti-size-control-padding-x, var(--manti-space-3) )`        |
| `select`            | `--manti-select-font-size`                  | `var(--manti-size-text, var(--manti-text-sm))`                       |
| `select`            | `--manti-select-icon-size`                  | `var(--manti-size-icon, var(--manti-text-base))`                     |
| `select`            | `--manti-select-content-max-height`         | `18rem`                                                              |
| `select`            | `--manti-select-content-padding`            | `var( --manti-size-panel-padding, var(--manti-space-2) )`            |
| `select`            | `--manti-select-content-gap`                | `var( --manti-size-panel-gap, var(--manti-space-1) )`                |
| `select`            | `--manti-select-item-padding-y`             | `var( --manti-size-item-padding-y, var(--manti-space-2) )`           |
| `select`            | `--manti-select-item-padding-x`             | `var( --manti-size-item-padding-x, var(--manti-space-3) )`           |
| `select`            | `--manti-select-item-gap`                   | `var(--manti-size-item-gap, var(--manti-space-2))`                   |
| `select`            | `--manti-select-item-radius`                | `var( --manti-size-item-radius, var(--manti-radius-sm) )`            |
| `select`            | `--manti-select-item-font-size`             | `var(--manti-size-text, var(--manti-text-sm))`                       |
| `signature-pad`     | `--manti-signature-pad-height`              | `12rem`                                                              |
| `slider`            | `--manti-slider-thumb-size`                 | `1.125rem`                                                           |
| `slider`            | `--manti-slider-track-size`                 | `0.375rem`                                                           |
| `slider`            | `--manti-slider-length`                     | `12rem`                                                              |
| `slider`            | `--manti-slider-marker-size`                | `0.25rem`                                                            |
| `spinner`           | `--manti-spinner-size`                      | `1.25rem`                                                            |
| `spinner`           | `--manti-spinner-thickness`                 | `2px`                                                                |
| `splitter`          | `--manti-splitter-handle-size`              | `0.375rem`                                                           |
| `splitter`          | `--manti-splitter-line-size`                | `0.125rem`                                                           |
| `splitter`          | `--manti-splitter-line-size-active`         | `0.625rem`                                                           |
| `steps`             | `--manti-steps-indicator-size`              | `2rem`                                                               |
| `switch`            | `--manti-switch-track-width`                | `2.75rem`                                                            |
| `switch`            | `--manti-switch-track-height`               | `1.5rem`                                                             |
| `switch`            | `--manti-switch-track-padding`              | `0.1875rem`                                                          |
| `tags-input`        | `--manti-tags-input-height`                 | `var(--manti-control-height-md)`                                     |
| `text`              | `--manti-text-font-size`                    | `var(--manti-text-base)`                                             |
| `text`              | `--manti-text-line-height`                  | `var(--manti-leading-normal)`                                        |
| `text`              | `--manti-text-weight`                       | `var(--manti-weight-regular)`                                        |
| `text`              | `--manti-text-tracking`                     | `var(--manti-tracking-normal)`                                       |
| `time-picker`       | `--manti-time-picker-height`                | `var( --manti-size-control-height, var(--manti-control-height-md) )` |
| `time-picker`       | `--manti-time-picker-padding-x`             | `var( --manti-size-control-padding-x, var(--manti-space-3) )`        |
| `time-picker`       | `--manti-time-picker-column-height`         | `15rem`                                                              |
| `time-picker`       | `--manti-time-picker-content-padding`       | `var( --manti-size-panel-padding, var(--manti-space-2) )`            |
| `time-picker`       | `--manti-time-picker-cell-min-width`        | `3.5rem`                                                             |
| `time-picker`       | `--manti-time-picker-cell-padding-y`        | `var( --manti-size-item-padding-y, var(--manti-space-2) )`           |
| `time-picker`       | `--manti-time-picker-cell-padding-x`        | `var( --manti-size-item-padding-x, var(--manti-space-3) )`           |
| `time-picker`       | `--manti-time-picker-cell-radius`           | `var( --manti-size-item-radius, var(--manti-radius-sm) )`            |
| `time-picker`       | `--manti-time-picker-cell-font-size`        | `var( --manti-size-text, var(--manti-text-sm) )`                     |
| `toast`             | `--manti-toast-width`                       | `20rem`                                                              |
| `toast`             | `--manti-toast-radius`                      | `var(--manti-radius-lg)`                                             |
| `toggle`            | `--manti-toggle-size`                       | `2.5rem`                                                             |
| `toggle-group`      | `--manti-toggle-group-height`               | `2rem`                                                               |
| `toggle-group`      | `--manti-toggle-group-padding-x`            | `var(--manti-space-3)`                                               |
| `tooltip`           | `--manti-tooltip-max-width`                 | `18rem`                                                              |
| `tooltip`           | `--manti-tooltip-z-index`                   | `var(--manti-z-popover)`                                             |
| `tour`              | `--manti-tour-width`                        | `20rem`                                                              |
| `tour`              | `--manti-tour-overlay-extent`               | `100vmax`                                                            |

<!-- @component-tokens:generated:end -->
