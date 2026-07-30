import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable } from './DataTable';
import type { DataTableColumn, DataTableRowComponentProps } from './DataTable';

interface RowValue {
  id: string;
  name: string;
}

const columns: DataTableColumn<RowValue>[] = [
  { accessorKey: 'name', header: 'Name' },
];

function HookRow({
  row,
  rowProps,
  children,
}: DataTableRowComponentProps<RowValue>) {
  const [resolved] = useState(() => `resolved-${row.id}`);
  return (
    <tr {...rowProps} data-resolved={resolved}>
      {children}
    </tr>
  );
}

describe('DataTable', () => {
  it('uses a hook-safe row component and merges row/cell props', () => {
    render(
      <DataTable
        columns={columns}
        data={[{ id: '1', name: 'Mantı' }]}
        getRowId={(row) => row.id}
        rowComponent={HookRow}
        getRowProps={(row) => ({ 'aria-label': `Row ${row.id}` })}
        getCellProps={(_row, columnId) => ({
          'data-column-id': columnId,
        })}
      />,
    );

    expect(screen.getByRole('row', { name: 'Row 1' })).toHaveAttribute(
      'data-resolved',
      'resolved-1',
    );
    expect(screen.getByRole('cell')).toHaveAttribute('data-column-id', 'name');
  });
});
