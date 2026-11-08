import { useState } from 'react';
import type { Story, StoryDefault } from '@ladle/react';

import { Badge } from '../Badge/Badge.js';
import { DataTable } from './DataTable.js';
import type { DataTableColumn, DataTableProps } from './DataTable.js';
import type { DataTableRowComponentProps } from './DataTable.js';

interface Invoice {
  id: string;
  customer: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
}

type InvoiceTableProps = DataTableProps<Invoice>;

const data: Invoice[] = [
  { id: 'INV-001', customer: 'Acme Corp', status: 'paid', amount: 1200 },
  { id: 'INV-002', customer: 'Globex', status: 'pending', amount: 450.5 },
  { id: 'INV-003', customer: 'Initech', status: 'overdue', amount: 3120 },
  { id: 'INV-004', customer: 'Umbrella', status: 'paid', amount: 88 },
  { id: 'INV-005', customer: 'Soylent', status: 'pending', amount: 640 },
];

const statusVariant = {
  paid: 'primary',
  pending: 'outline',
  overdue: 'danger',
} as const;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<Invoice['status']>();
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: { align: 'end' },
    cell: ({ getValue }) => currency.format(getValue<number>()),
  },
];

const manyInvoices: Invoice[] = Array.from({ length: 24 }, (_, index) => ({
  id: `INV-${String(index + 1).padStart(3, '0')}`,
  customer: ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli'][
    index % 6
  ],
  status: (['paid', 'pending', 'overdue'] as const)[index % 3],
  amount: ((index * 137) % 900) + 40,
}));

export default {
  title: 'Components/DataTable',
  args: { columns, data },
  meta: { layout: 'padded' },
} satisfies StoryDefault<InvoiceTableProps>;

export const Playground: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);

export const Sortable: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
Sortable.args = { sortable: true };

export const ZebraSticky: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
ZebraSticky.args = { zebra: true, interactive: true, sortable: true };

export const Sizes: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
Sizes.args = { size: 'sm', sortable: true, zebra: true };

export const Filterable: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
Filterable.args = { filterable: true, sortable: true };

export const Selectable: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
Selectable.args = {
  selectable: true,
  onSelectionChange: (rows) => console.log('selected', rows),
};

export const Paginated: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
Paginated.args = {
  data: manyInvoices,
  paginated: true,
  pageSize: 6,
  sortable: true,
};

export const FullFeatured: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
FullFeatured.args = {
  data: manyInvoices,
  title: 'Invoices',
  sortable: true,
  filterable: true,
  paginated: true,
  pageSize: 6,
  selectable: true,
  zebra: true,
  interactive: true,
};

export const Empty: Story<InvoiceTableProps> = (args) => (
  <DataTable<Invoice> {...args} />
);
Empty.args = { data: [], emptyContent: 'No invoices yet.' };

function LiveInvoiceRow({
  row,
  rowProps,
  children,
}: DataTableRowComponentProps<Invoice>) {
  const [mountedAt] = useState(() => Date.now());
  return (
    <tr {...rowProps} data-entity-id={row.id} data-mounted-at={mountedAt}>
      {children}
    </tr>
  );
}

export const CustomRowComponent: Story<InvoiceTableProps> = () => (
  <DataTable<Invoice>
    columns={columns}
    data={data}
    rowComponent={LiveInvoiceRow}
    getRowId={(row) => row.id}
    getRowProps={(row) => ({ 'aria-label': `Invoice ${row.id}` })}
  />
);
