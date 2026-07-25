import { DataTable } from '@manti-ui/react';
import type { DataTableColumn } from '@manti-ui/react';

interface Member {
  name: string;
  role: string;
  location: string;
}

const data: Member[] = [
  { name: 'Ada Lovelace', role: 'Engineer', location: 'London' },
  { name: 'Alan Turing', role: 'Researcher', location: 'Manchester' },
  { name: 'Grace Hopper', role: 'Architect', location: 'New York' },
];

const columns: DataTableColumn<Member>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'location', header: 'Location' },
];

export default function DataTableSizes() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--manti-space-6)',
        width: '100%',
      }}
    >
      <DataTable size="sm" columns={columns} data={data} />
      <DataTable size="md" columns={columns} data={data} />
      <DataTable size="lg" columns={columns} data={data} />
    </div>
  );
}
