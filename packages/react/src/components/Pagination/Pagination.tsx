import { useId } from 'react';
import { pagination } from '@manti-ui/folds';
import type { MantiTone } from '@manti-ui/tokens';
import { normalizeProps, useMachine } from '@zag-js/react';

import { cx } from '../../internal/props';

export interface PaginationProps {
  /** Total number of items across all pages. */
  count: number;
  /** Items per page. */
  pageSize?: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Initial page for uncontrolled usage. */
  defaultPage?: number;
  /** Called whenever the page changes. */
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page. */
  siblingCount?: number;
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Active-page tone. */
  tone?: MantiTone;
  id?: string;
  className?: string;
}

const arrow = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** A page navigator backed by the Zag.js pagination machine. */
export function Pagination({
  count,
  pageSize,
  page,
  defaultPage,
  onPageChange,
  siblingCount,
  size = 'md',
  tone = 'primary',
  id,
  className,
}: PaginationProps) {
  const autoId = useId();
  const service = useMachine(pagination.machine, {
    id: id ?? autoId,
    count,
    pageSize,
    page,
    defaultPage,
    siblingCount,
    onPageChange: onPageChange
      ? (details) => onPageChange(details.page)
      : undefined,
  });
  const api = pagination.connect(service, normalizeProps);

  return (
    <nav
      {...api.getRootProps()}
      data-size={size}
      data-tone={tone}
      className={cx(className)}
    >
      <button {...api.getPrevTriggerProps()} aria-label="Previous page">
        {arrow('M10 3 5 8l5 5')}
      </button>
      {api.pages.map((page, index) =>
        page.type === 'page' ? (
          <button
            key={page.value}
            {...api.getItemProps({ type: 'page', value: page.value })}
          >
            {page.value}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} {...api.getEllipsisProps({ index })}>
            &#8230;
          </span>
        ),
      )}
      <button {...api.getNextTriggerProps()} aria-label="Next page">
        {arrow('M6 3l5 5-5 5')}
      </button>
    </nav>
  );
}
