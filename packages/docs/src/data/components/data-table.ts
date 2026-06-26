import type { ComponentMeta } from '../component-meta-types';

export const meta: ComponentMeta = {
  scope: 'data-table',
  props: [
    {
      name: 'columns',
      type: 'DataTableColumn<TData>[]',
      description:
        'Column definitions (TanStack `ColumnDef`). Set `meta.align` to align a column.',
    },
    {
      name: 'data',
      type: 'TData[]',
      description: 'The rows to render.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      description:
        'A heading shown at the start of the toolbar; also names the table.',
    },
    {
      name: 'sortable',
      type: 'boolean',
      default: 'false',
      description: 'Enable click-to-sort headers (one column at a time).',
    },
    {
      name: 'filterable',
      type: 'boolean',
      default: 'false',
      description: 'Add a global search box that filters across every column.',
    },
    {
      name: 'filterPlaceholder',
      type: 'string',
      default: `'Search…'`,
      description: 'Placeholder for the search box.',
    },
    {
      name: 'paginated',
      type: 'boolean',
      default: 'false',
      description: 'Paginate client-side, with a Pagination control in the footer.',
    },
    {
      name: 'pageSize',
      type: 'number',
      default: '10',
      description: 'Rows per page when `paginated`.',
    },
    {
      name: 'selectable',
      type: 'boolean',
      default: 'false',
      description: 'Add a leading checkbox column for row selection.',
    },
    {
      name: 'onSelectionChange',
      type: '(rows: TData[]) => void',
      description: 'Called with the selected rows whenever the selection changes.',
    },
    {
      name: 'size',
      type: `'sm' | 'md' | 'lg'`,
      default: `'md'`,
      description: 'Row density.',
    },
    {
      name: 'stickyHeader',
      type: 'boolean',
      default: 'false',
      description: 'Pin the header while the body scrolls (needs a bounded height).',
    },
    {
      name: 'zebra',
      type: 'boolean',
      default: 'false',
      description: 'Tint alternating rows.',
    },
    {
      name: 'interactive',
      type: 'boolean',
      default: 'false',
      description: 'Highlight rows on hover.',
    },
    {
      name: 'caption',
      type: 'ReactNode',
      description: 'Optional caption rendered above the grid.',
    },
    {
      name: 'emptyContent',
      type: 'ReactNode',
      default: `'No data'`,
      description: 'Shown in place of rows when `data` is empty.',
    },
    {
      name: 'getRowId',
      type: '(row: TData, index: number) => string',
      description: 'Derive a stable row id (defaults to the row index).',
    },
  ],
  anatomy: [
    { part: 'root', description: 'The panel framing the toolbar, grid, and footer.' },
    {
      part: 'toolbar',
      description: 'The top bar holding the title and search box.',
    },
    { part: 'title', description: 'The toolbar heading (when `title` is set).' },
    { part: 'search', description: 'The search field wrapper.' },
    { part: 'viewport', description: 'The scrollable region wrapping the table.' },
    { part: 'table', description: 'The <table> element.' },
    { part: 'caption', description: 'The <caption>, when provided.' },
    { part: 'header', description: 'The <thead>.' },
    { part: 'header-row', description: 'A header <tr>.' },
    {
      part: 'header-cell',
      description: 'A header <th>; carries `aria-sort` and `data-align`.',
    },
    {
      part: 'sort-trigger',
      description: 'The header button toggling sort (sortable columns).',
    },
    {
      part: 'sort-indicator',
      description: 'The arrow reflecting sort direction.',
    },
    { part: 'body', description: 'The <tbody>.' },
    {
      part: 'row',
      description: 'A body <tr>; carries `data-selected` when selected.',
    },
    { part: 'cell', description: 'A body <td>; carries `data-align`.' },
    { part: 'empty', description: 'The cell shown when there are no rows.' },
    {
      part: 'footer',
      description: 'The bottom bar holding the selection summary and pager.',
    },
    {
      part: 'selection-summary',
      description: 'The “N selected” count (when selectable).',
    },
  ],
};
