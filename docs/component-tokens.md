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
| `avatar`            | `--manti-avatar-size`                       | `2.5rem`                         |
| `badge`             | `--manti-badge-font-size`                   | `var(--manti-text-xs)`           |
| `badge`             | `--manti-badge-padding-x`                   | `var(--manti-space-2)`           |
| `badge`             | `--manti-badge-padding-y`                   | `0.125rem`                       |
| `button`            | `--manti-button-radius`                     | `var(--manti-radius-md)`         |
| `button`            | `--manti-button-height`                     | `var(--manti-control-height-md)` |
| `button`            | `--manti-button-padding-x`                  | `var(--manti-space-4)`           |
| `button`            | `--manti-button-font-size`                  | `var(--manti-text-sm)`           |
| `button`            | `--manti-button-gap`                        | `var(--manti-space-2)`           |
| `carousel`          | `--manti-carousel-viewport-height`          | `22rem`                          |
| `checkbox`          | `--manti-checkbox-size`                     | `1.25rem`                        |
| `clipboard`         | `--manti-clipboard-height`                  | `var(--manti-control-height-md)` |
| `color-picker`      | `--manti-color-picker-height`               | `var(--manti-control-height-md)` |
| `color-picker`      | `--manti-color-picker-panel-width`          | `16rem`                          |
| `color-picker`      | `--manti-color-picker-area-height`          | `9rem`                           |
| `combobox`          | `--manti-combobox-height`                   | `var(--manti-control-height-md)` |
| `combobox`          | `--manti-combobox-content-max-height`       | `18rem`                          |
| `date-picker`       | `--manti-date-picker-height`                | `var(--manti-control-height-md)` |
| `dialog`            | `--manti-dialog-max-width`                  | `32rem`                          |
| `drawer`            | `--manti-drawer-size`                       | `24rem`                          |
| `editable`          | `--manti-editable-height`                   | `var(--manti-control-height-md)` |
| `field`             | `--manti-field-height`                      | `var(--manti-control-height-md)` |
| `field`             | `--manti-field-padding-x`                   | `var(--manti-space-3)`           |
| `floating-panel`    | `--manti-floating-panel-min-width`          | `16rem`                          |
| `floating-panel`    | `--manti-floating-panel-min-height`         | `8rem`                           |
| `hover-card`        | `--manti-hover-card-max-width`              | `20rem`                          |
| `listbox`           | `--manti-listbox-min-width`                 | `14rem`                          |
| `listbox`           | `--manti-listbox-max-height`                | `18rem`                          |
| `marquee`           | `--manti-marquee-duration`                  | `20s`                            |
| `marquee`           | `--manti-marquee-gap`                       | `var(--manti-space-8)`           |
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
| `steps`             | `--manti-steps-indicator-size`              | `2rem`                           |
| `switch`            | `--manti-switch-track-width`                | `2.75rem`                        |
| `switch`            | `--manti-switch-track-height`               | `1.5rem`                         |
| `switch`            | `--manti-switch-track-padding`              | `0.1875rem`                      |
| `tags-input`        | `--manti-tags-input-height`                 | `var(--manti-control-height-md)` |
| `time-picker`       | `--manti-time-picker-height`                | `var(--manti-control-height-md)` |
| `time-picker`       | `--manti-time-picker-column-height`         | `15rem`                          |
| `time-picker`       | `--manti-time-picker-cell-min-width`        | `2.75rem`                        |
| `timer`             | `--manti-timer-item-min-width`              | `3.5rem`                         |
| `toast`             | `--manti-toast-width`                       | `20rem`                          |
| `toggle`            | `--manti-toggle-size`                       | `2.5rem`                         |
| `toggle-group`      | `--manti-toggle-group-height`               | `2rem`                           |
| `toggle-group`      | `--manti-toggle-group-padding-x`            | `var(--manti-space-3)`           |
| `tooltip`           | `--manti-tooltip-max-width`                 | `18rem`                          |
| `tour`              | `--manti-tour-width`                        | `20rem`                          |

<!-- @component-tokens:generated:end -->
