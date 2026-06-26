import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge/Badge';
import { DataTable } from './DataTable';
import type { DataTableColumn } from './DataTable';

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

const manyInvoices: Invoice[] = Array.from({ length: 24 }, (_, index) => ({
  id: `INV-${String(index + 1).padStart(3, '0')}`,
  customer: ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli'][
    index % 6
  ],
  status: (['paid', 'pending', 'overdue'] as const)[index % 3],
  amount: ((index * 137) % 900) + 40,
}));

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  args: { columns, data },
} satisfies Meta<typeof DataTable<Invoice>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sortable: Story = {
  args: { sortable: true },
};

export const ZebraSticky: Story = {
  args: { zebra: true, interactive: true, sortable: true },
};

export const Sizes: Story = {
  args: { size: 'sm', sortable: true, zebra: true },
};

export const Filterable: Story = {
  args: { filterable: true, sortable: true },
};

export const Selectable: Story = {
  args: {
    selectable: true,
    onSelectionChange: (rows) => console.log('selected', rows),
  },
};

export const Paginated: Story = {
  args: { data: manyInvoices, paginated: true, pageSize: 6, sortable: true },
};

export const FullFeatured: Story = {
  args: {
    data: manyInvoices,
    title: 'Invoices',
    sortable: true,
    filterable: true,
    paginated: true,
    pageSize: 6,
    selectable: true,
    zebra: true,
    interactive: true,
  },
};

export const Empty: Story = {
  args: { data: [], emptyContent: 'No invoices yet.' },
};
