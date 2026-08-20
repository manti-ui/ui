import { Pagination } from '@manti-ui/react';

export default function PaginationSizes() {
  return (
    <div className="pagination-options">
      <Pagination size="sm" count={120} pageSize={20} defaultPage={3} />
      <Pagination size="md" count={120} pageSize={20} defaultPage={3} />
      <Pagination size="lg" count={120} pageSize={20} defaultPage={3} />
    </div>
  );
}
