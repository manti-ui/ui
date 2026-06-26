import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { table as tableContract } from '@manti-ui/folds';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cx, dataBool } from '../../internal/props';
import { Checkbox } from '../Checkbox/Checkbox';
import { Pagination } from '../Pagination/Pagination';
import { TextField } from '../TextField/TextField';

/**
 * A column definition — TanStack's `ColumnDef`, re-exported so consumers type
 * their columns without depending on `@tanstack/*` directly. Set `meta.align`
 * (`'start' | 'center' | 'end'`) to align a column's header and cells.
 */
export type DataTableColumn<TData, TValue = unknown> = tableContract.ColumnDef<
  TData,
  TValue
>;

export type DataTableSize = 'sm' | 'md' | 'lg';

export interface DataTableProps<TData> {
  /** Column definitions. Each is a TanStack `ColumnDef` (`DataTableColumn`). */
  columns: DataTableColumn<TData>[];
  /** The rows to render. */
  data: TData[];
  /** Enable click-to-sort headers (one column at a time). */
  sortable?: boolean;
  /** A heading shown at the start of the toolbar; also names the table. */
  title?: ReactNode;
  /** Add a global search box that filters across every column. */
  filterable?: boolean;
  /** Placeholder for the search box. */
  filterPlaceholder?: string;
  /** Paginate client-side, with a Manti Pagination control in the footer. */
  paginated?: boolean;
  /** Rows per page when `paginated`. */
  pageSize?: number;
  /** Add a leading checkbox column for row selection. */
  selectable?: boolean;
  /** Called with the selected rows whenever the selection changes. */
  onSelectionChange?: (rows: TData[]) => void;
  /** Row density. */
  size?: DataTableSize;
  /** Pin the header to the top while the body scrolls (needs a bounded height). */
  stickyHeader?: boolean;
  /** Tint alternating rows. */
  zebra?: boolean;
  /** Highlight rows on hover. Pair with real row semantics if rows are clickable. */
  interactive?: boolean;
  /** Optional table caption, rendered above the grid. */
  caption?: ReactNode;
  /** Shown in place of rows when there are no rows. Defaults to “No data”. */
  emptyContent?: ReactNode;
  /** Derive a stable row id (defaults to the row index). */
  getRowId?: (row: TData, index: number) => string;
  id?: string;
  className?: string;
}

const SCOPE = 'data-table';
const SELECT_COLUMN_ID = '__manti_select';

function SortIndicator({ state }: { state: 'asc' | 'desc' | 'none' }) {
  return (
    <svg
      data-scope={SCOPE}
      data-part="sort-indicator"
      data-state={state}
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path d="M6 3l3.5 4.5h-7z" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M7 1.5a5.5 5.5 0 1 0 3.4 9.82l3.14 3.14 1.06-1.06-3.14-3.14A5.5 5.5 0 0 0 7 1.5Zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

// A leading checkbox column. Defined at module scope so its identity is stable
// across renders; it reaches selection state through the row/table context.
function selectionColumn<TData>(): DataTableColumn<TData> {
  return {
    id: SELECT_COLUMN_ID,
    enableSorting: false,
    meta: { align: 'center' },
    header: ({ table }) => (
      <Checkbox
        size="sm"
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        size="sm"
        aria-label={`Select row ${row.index + 1}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  };
}

/**
 * A data grid backed by the framework-agnostic TanStack `table-core` machine
 * (via the React adapter). The machine owns sorting, filtering, pagination, and
 * selection; this adapter renders the semantic `<table>` anatomy and Manti
 * styling, and composes Manti's own TextField, Pagination, and Checkbox for the
 * search, pager, and selection controls.
 */
export function DataTable<TData>({
  columns,
  data,
  title,
  sortable = false,
  filterable = false,
  filterPlaceholder = 'Search…',
  paginated = false,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  size = 'md',
  stickyHeader,
  zebra,
  interactive,
  caption,
  emptyContent,
  getRowId,
  id,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<tableContract.SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] =
    useState<tableContract.RowSelectionState>({});
  const [pagination, setPagination] = useState<tableContract.PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const reactId = useId();
  const titleId = title != null ? `${id ?? reactId}-title` : undefined;

  const tableColumns = useMemo(
    () => (selectable ? [selectionColumn<TData>(), ...columns] : columns),
    [columns, selectable],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId,
    enableSorting: sortable,
    enableRowSelection: selectable,
    state: {
      ...(sortable ? { sorting } : {}),
      ...(filterable ? { globalFilter } : {}),
      ...(selectable ? { rowSelection } : {}),
      ...(paginated ? { pagination } : {}),
    },
    onSortingChange: sortable ? setSorting : undefined,
    onGlobalFilterChange: filterable ? setGlobalFilter : undefined,
    onRowSelectionChange: selectable ? setRowSelection : undefined,
    onPaginationChange: paginated ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: filterable ? getFilteredRowModel() : undefined,
    getPaginationRowModel: paginated ? getPaginationRowModel() : undefined,
  });

  // Surface the selected rows without re-running on every parent render: hold the
  // callback in a ref and fire only when the selection actually changes.
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  useEffect(() => {
    if (!selectable) return;
    onSelectionChangeRef.current?.(
      table.getSelectedRowModel().rows.map((row) => row.original),
    );
  }, [rowSelection, selectable, table]);

  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  const showPagination = paginated && table.getPageCount() > 1;
  const showFooter = showPagination || selectable;

  return (
    <div
      data-scope={SCOPE}
      data-part="root"
      data-size={size}
      data-sticky={dataBool(stickyHeader)}
      data-zebra={dataBool(zebra)}
      data-interactive={dataBool(interactive)}
      id={id}
      className={cx(className)}
    >
      {(title != null || filterable) && (
        <div data-scope={SCOPE} data-part="toolbar">
          {title != null && (
            <div data-scope={SCOPE} data-part="title" id={titleId}>
              {title}
            </div>
          )}
          {filterable && (
            <div data-scope={SCOPE} data-part="search">
              <TextField
                size="sm"
                fullWidth
                type="search"
                aria-label="Search"
                placeholder={filterPlaceholder}
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                leadingAddon={<SearchIcon />}
              />
            </div>
          )}
        </div>
      )}

      <div data-scope={SCOPE} data-part="viewport">
        <table
          data-scope={SCOPE}
          data-part="table"
          aria-labelledby={titleId}
        >
          {caption != null && (
            <caption data-scope={SCOPE} data-part="caption">
              {caption}
            </caption>
          )}
          <thead data-scope={SCOPE} data-part="header">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} data-scope={SCOPE} data-part="header-row">
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align;
                  const canSort = sortable && header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const ariaSort = canSort
                    ? sorted === 'asc'
                      ? 'ascending'
                      : sorted === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined;
                  const label = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      );

                  return (
                    <th
                      key={header.id}
                      data-scope={SCOPE}
                      data-part="header-cell"
                      data-align={align}
                      colSpan={header.colSpan}
                      scope="col"
                      aria-sort={ariaSort}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          data-scope={SCOPE}
                          data-part="sort-trigger"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {label}
                          <SortIndicator state={sorted || 'none'} />
                        </button>
                      ) : (
                        label
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody data-scope={SCOPE} data-part="body">
            {rows.length === 0 ? (
              <tr data-scope={SCOPE} data-part="row">
                <td
                  data-scope={SCOPE}
                  data-part="empty"
                  colSpan={columnCount || 1}
                >
                  {emptyContent ?? 'No data'}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  data-scope={SCOPE}
                  data-part="row"
                  data-selected={dataBool(row.getIsSelected())}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      data-scope={SCOPE}
                      data-part="cell"
                      data-align={cell.column.columnDef.meta?.align}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showFooter && (
        <div data-scope={SCOPE} data-part="footer">
          {selectable && (
            <span data-scope={SCOPE} data-part="selection-summary">
              {table.getSelectedRowModel().rows.length} selected
            </span>
          )}
          {showPagination && (
            <Pagination
              size="sm"
              count={table.getPrePaginationRowModel().rows.length}
              pageSize={pagination.pageSize}
              page={pagination.pageIndex + 1}
              onPageChange={(page) => table.setPageIndex(page - 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}
