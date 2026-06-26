import { Badge, DataTable } from '@manti-ui/react';
import type { DataTableColumn } from '@manti-ui/react';

interface Invoice {
  id: string;
  customer: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
}

const data: Invoice[] = [
  { id: 'INV-001', customer: 'Acme Corp', status: 'paid', amount: 1200 },
  { id: 'INV-002', customer: 'Globex', status: 'pending', amount: 450.5 },
  { id: 'INV-003', customer: 'Initech', status: 'overdue', amount: 3120 },
  { id: 'INV-004', customer: 'Umbrella', status: 'paid', amount: 88 },
  { id: 'INV-005', customer: 'Soylent', status: 'pending', amount: 640 },
  { id: 'INV-006', customer: 'Hooli', status: 'paid', amount: 2750 },
  { id: 'INV-007', customer: 'Pied Piper', status: 'overdue', amount: 410 },
  { id: 'INV-008', customer: 'Stark Industries', status: 'paid', amount: 9800 },
  { id: 'INV-009', customer: 'Wayne Enterprises', status: 'pending', amount: 1500 },
  { id: 'INV-010', customer: 'Wonka', status: 'paid', amount: 320 },
  { id: 'INV-011', customer: 'Cyberdyne', status: 'overdue', amount: 6100 },
  { id: 'INV-012', customer: 'Tyrell Corp', status: 'paid', amount: 240 },
];

const statusTone = {
  paid: 'success',
  pending: 'warning',
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
      return (
        <Badge tone={statusTone[status]} variant="soft">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: { align: 'end' },
    cell: ({ getValue }) => currency.format(getValue<number>()),
  },
];

export default function DataTableFull() {
  return (
    <DataTable
      columns={columns}
      data={data}
      title="Invoices"
      getRowId={(row) => row.id}
      sortable
      filterable
      paginated
      pageSize={5}
      selectable
      zebra
      interactive
    />
  );
}
