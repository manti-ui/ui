/**
 * Headless table behavior — TanStack `@tanstack/table-core`.
 *
 * Like a Zag.js machine, table-core is the framework-agnostic brain: it owns
 * column definitions, sorting, filtering, pagination, grouping, and selection
 * state, and renders nothing. Each framework renderer wires it up with its own
 * adapter (`@tanstack/react-table`, `@tanstack/vue-table`, …) and writes the
 * markup. Re-exporting the contract here keeps column-definition types and the
 * row-model helpers shared across every future Manti renderer.
 */
export * from '@tanstack/table-core';

import type { RowData } from '@tanstack/table-core';

// Manti adds one convention to the column contract: `meta.align`, a shared
// horizontal-alignment hint every renderer maps onto its header and cells.
// Declared here so the augmentation travels with the contract, not per renderer.
declare module '@tanstack/table-core' {
  // Names must match the original ColumnMeta declaration verbatim (TS2428), even
  // though `align` doesn't reference them — hence the targeted lint exception.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Horizontal alignment for this column's header and cells. */
    align?: 'start' | 'center' | 'end';
  }
}
