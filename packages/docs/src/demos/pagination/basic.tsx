import { Pagination } from '@manti-ui/react';

export default function PaginationBasic() {
  return (
    <Pagination
      count={200}
      pageSize={20}
      defaultPage={3}
      siblingCount={1}
      tone="primary"
    />
  );
}
