import { Pagination } from '@manti-ui/react';

export default function PaginationManyPages() {
  return (
    <Pagination
      count={1000}
      pageSize={20}
      defaultPage={12}
      siblingCount={2}
      tone="primary"
    />
  );
}
