# Component tokens reference

> **Generated** from the `componentTokens` registry in `@manti-ui/tokens` and
> each component's CSS. Do not edit the table by hand — run
> `pnpm --filter @manti-ui/styles gen:component-tokens-doc`. The styles build
> fails if this file is stale.

Tier-3 **component tokens** are the public, semver-stable per-component override
surface. Each `--manti-{component}-{property}` defaults to the value shown
below. Prefer Tier-2 semantic tokens for system-wide theming; reach for a
component token only to make one component diverge on purpose — see
[styling.md](./styling.md#component-tokens-tier-3).

<!-- @component-tokens:generated:start -->

| Component           | Token                                       | Default                          |
| ------------------- | ------------------------------------------- | -------------------------------- |
| `accordion`         | `--manti-accordion-radius`                  | `var(--manti-radius-lg)`         |
| `accordion`         | `--manti-accordion-padding-x`               | `var(--manti-space-5)`           |
| `accordion`         | `--manti-accordion-padding-y`               | `var(--manti-space-4)`           |
| `accordion`         | `--manti-accordion-gap`                     | `var(--manti-space-3)`           |
| `alert`             | `--manti-alert-radius`                      | `var(--manti-radius-lg)`         |
| `alert`             | `--manti-alert-padding-x`                   | `var(--manti-space-4)`           |
| `alert`             | `--manti-alert-padding-y`                   | `var(--manti-space-4)`           |
| `alert`             | `--manti-alert-gap`                         | `var(--manti-space-3)`           |
| `alert`             | `--manti-alert-icon-size`                   | `1.25rem`                        |
| `alert`             | `--manti-alert-dismiss-size`                | `1.5rem`                         |
| `alert`             | `--manti-alert-font-size`                   | `var(--manti-text-sm)`           |
| `avatar`            | `--manti-avatar-size`                       | `2.5rem`                         |
| `avatar`            | `--manti-avatar-radius`                     | `var(--manti-radius-full)`       |
| `badge`             | `--manti-badge-radius`                      | `var(--manti-radius-full)`       |
| `badge`             | `--manti-badge-font-size`                   | `var(--manti-text-xs)`           |
| `badge`             | `--manti-badge-padding-y`                   | `0.125rem`                       |
| `badge`             | `--manti-badge-padding-x`                   | `var(--manti-space-2)`           |
| `badge`             | `--manti-badge-gap`                         | `var(--manti-space-1)`           |
| `badge`             | `--manti-badge-dot-size`                    | `0.5em`                          |
| `button`            | `--manti-button-radius`                     | `var(--manti-radius-md)`         |
| `button`            | `--manti-button-height`                     | `var(--manti-control-height-md)` |
| `button`            | `--manti-button-padding-x`                  | `var(--manti-space-4)`           |
| `button`            | `--manti-button-font-size`                  | `var(--manti-text-sm)`           |
| `button`            | `--manti-button-gap`                        | `var(--manti-space-2)`           |
| `card`              | `--manti-card-radius`                       | `var(--manti-radius-xl)`         |
| `card`              | `--manti-card-padding-x`                    | `var(--manti-space-6)`           |
| `card`              | `--manti-card-padding-y`                    | `var(--manti-space-6)`           |
| `carousel`          | `--manti-carousel-slide-gap`                | `var(--manti-space-3)`           |
| `carousel`          | `--manti-carousel-gap`                      | `var(--manti-space-3)`           |
| `carousel`          | `--manti-carousel-radius`                   | `var(--manti-radius-lg)`         |
| `carousel`          | `--manti-carousel-trigger-size`             | `2.25rem`                        |
| `carousel`          | `--manti-carousel-indicator-size`           | `0.5rem`                         |
| `carousel`          | `--manti-carousel-viewport-height`          | `22rem`                          |
| `checkbox`          | `--manti-checkbox-size`                     | `1.25rem`                        |
| `checkbox`          | `--manti-checkbox-radius`                   | `var(--manti-radius-sm)`         |
| `checkbox`          | `--manti-checkbox-gap`                      | `var(--manti-space-3)`           |
| `checkbox`          | `--manti-checkbox-font-size`                | `var(--manti-text-sm)`           |
| `clipboard`         | `--manti-clipboard-height`                  | `var(--manti-control-height-md)` |
| `clipboard`         | `--manti-clipboard-radius`                  | `var(--manti-radius-md)`         |
| `clipboard`         | `--manti-clipboard-padding-x`               | `var(--manti-space-3)`           |
| `clipboard`         | `--manti-clipboard-gap`                     | `var(--manti-space-2)`           |
| `clipboard`         | `--manti-clipboard-font-size`               | `var(--manti-text-sm)`           |
| `clipboard`         | `--manti-clipboard-trigger-width`           | `2.5rem`                         |
| `collapsible`       | `--manti-collapsible-radius`                | `var(--manti-radius-md)`         |
| `collapsible`       | `--manti-collapsible-padding-x`             | `var(--manti-space-4)`           |
| `collapsible`       | `--manti-collapsible-padding-y`             | `var(--manti-space-3)`           |
| `collapsible`       | `--manti-collapsible-gap`                   | `var(--manti-space-2)`           |
| `color-picker`      | `--manti-color-picker-height`               | `var(--manti-control-height-md)` |
| `color-picker`      | `--manti-color-picker-panel-width`          | `16rem`                          |
| `color-picker`      | `--manti-color-picker-area-height`          | `9rem`                           |
| `combobox`          | `--manti-combobox-height`                   | `var(--manti-control-height-md)` |
| `combobox`          | `--manti-combobox-content-max-height`       | `18rem`                          |
| `data-table`        | `--manti-data-table-radius`                 | `var(--manti-radius-lg)`         |
| `data-table`        | `--manti-data-table-cell-padding-x`         | `var(--manti-space-4)`           |
| `data-table`        | `--manti-data-table-cell-padding-y`         | `var(--manti-space-3)`           |
| `data-table`        | `--manti-data-table-font-size`              | `var(--manti-text-sm)`           |
| `data-table`        | `--manti-data-table-header-font-size`       | `var(--manti-text-xs)`           |
| `date-picker`       | `--manti-date-picker-height`                | `var(--manti-control-height-md)` |
| `dialog`            | `--manti-dialog-max-width`                  | `32rem`                          |
| `dialog`            | `--manti-dialog-radius`                     | `var(--manti-radius-lg)`         |
| `dialog`            | `--manti-dialog-padding-x`                  | `var(--manti-space-6)`           |
| `dialog`            | `--manti-dialog-padding-y`                  | `var(--manti-space-6)`           |
| `dialog`            | `--manti-dialog-gap`                        | `var(--manti-space-3)`           |
| `drawer`            | `--manti-drawer-size`                       | `24rem`                          |
| `editable`          | `--manti-editable-height`                   | `var(--manti-control-height-md)` |
| `field`             | `--manti-field-height`                      | `var(--manti-control-height-md)` |
| `field`             | `--manti-field-padding-x`                   | `var(--manti-space-3)`           |
| `field`             | `--manti-field-padding-y`                   | `var(--manti-space-2)`           |
| `floating-panel`    | `--manti-floating-panel-min-width`          | `16rem`                          |
| `floating-panel`    | `--manti-floating-panel-min-height`         | `8rem`                           |
| `hover-card`        | `--manti-hover-card-max-width`              | `20rem`                          |
| `listbox`           | `--manti-listbox-min-width`                 | `14rem`                          |
| `listbox`           | `--manti-listbox-max-height`                | `18rem`                          |
| `marquee`           | `--manti-marquee-gap`                       | `var(--manti-space-8)`           |
| `marquee`           | `--manti-marquee-duration`                  | `20s`                            |
| `menu`              | `--manti-menu-min-width`                    | `12rem`                          |
| `menu`              | `--manti-menu-max-width`                    | `20rem`                          |
| `navigation-menu`   | `--manti-navigation-menu-content-min-width` | `16rem`                          |
| `number-input`      | `--manti-number-input-height`               | `var(--manti-control-height-md)` |
| `number-input`      | `--manti-number-input-stepper-width`        | `2.25rem`                        |
| `pagination`        | `--manti-pagination-size`                   | `2.25rem`                        |
| `pin-input`         | `--manti-pin-input-size`                    | `2.75rem`                        |
| `popover`           | `--manti-popover-max-width`                 | `20rem`                          |
| `progress`          | `--manti-progress-track-height`             | `0.5rem`                         |
| `progress`          | `--manti-progress-circle-size`              | `5rem`                           |
| `rating-group`      | `--manti-rating-group-size`                 | `1.5rem`                         |
| `scroll-area`       | `--manti-scroll-area-size`                  | `var(--manti-space-2)`           |
| `segmented-control` | `--manti-segmented-control-height`          | `2rem`                           |
| `segmented-control` | `--manti-segmented-control-padding-x`       | `var(--manti-space-3)`           |
| `select`            | `--manti-select-height`                     | `var(--manti-control-height-md)` |
| `select`            | `--manti-select-content-max-height`         | `18rem`                          |
| `signature-pad`     | `--manti-signature-pad-height`              | `12rem`                          |
| `slider`            | `--manti-slider-thumb-size`                 | `1.125rem`                       |
| `slider`            | `--manti-slider-track-size`                 | `0.375rem`                       |
| `slider`            | `--manti-slider-length`                     | `12rem`                          |
| `spinner`           | `--manti-spinner-size`                      | `1.25rem`                        |
| `spinner`           | `--manti-spinner-thickness`                 | `2px`                            |
| `splitter`          | `--manti-splitter-handle-size`              | `0.375rem`                       |
| `splitter`          | `--manti-splitter-line-size`                | `0.125rem`                       |
| `splitter`          | `--manti-splitter-line-size-active`         | `0.625rem`                       |
| `steps`             | `--manti-steps-indicator-size`              | `2rem`                           |
| `switch`            | `--manti-switch-track-width`                | `2.75rem`                        |
| `switch`            | `--manti-switch-track-height`               | `1.5rem`                         |
| `switch`            | `--manti-switch-track-padding`              | `0.1875rem`                      |
| `tags-input`        | `--manti-tags-input-height`                 | `var(--manti-control-height-md)` |
| `time-picker`       | `--manti-time-picker-height`                | `var(--manti-control-height-md)` |
| `time-picker`       | `--manti-time-picker-column-height`         | `15rem`                          |
| `time-picker`       | `--manti-time-picker-cell-min-width`        | `3.5rem`                         |
| `timer`             | `--manti-timer-item-min-width`              | `3.5rem`                         |
| `toast`             | `--manti-toast-width`                       | `20rem`                          |
| `toggle`            | `--manti-toggle-size`                       | `2.5rem`                         |
| `toggle-group`      | `--manti-toggle-group-height`               | `2rem`                           |
| `toggle-group`      | `--manti-toggle-group-padding-x`            | `var(--manti-space-3)`           |
| `tooltip`           | `--manti-tooltip-max-width`                 | `18rem`                          |
| `tour`              | `--manti-tour-width`                        | `20rem`                          |

<!-- @component-tokens:generated:end -->
