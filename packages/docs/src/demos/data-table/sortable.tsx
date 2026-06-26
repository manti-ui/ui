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

export default function DataTableSortable() {
  return <DataTable columns={columns} data={data} sortable zebra interactive />;
}
