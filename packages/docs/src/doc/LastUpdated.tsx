import { Text } from '@manti-ui/react';

import docDates from 'virtual:manti-doc-dates';

/**
 * The page's last-edit date, rendered as visible copy.
 *
 * The date already reaches `dateModified` in the JSON-LD and the `article:*`
 * meta tags, but freshness only counts when a reader, or the assistant reading
 * on their behalf, can see it on the page. The source is the same git history
 * the prerenderer reads (`vite-plugin-doc-dates`), so the visible date and the
 * structured one are the same value.
 */
export function LastUpdated({ slug }: { slug: string }) {
  const modified = docDates[slug]?.modified;
  if (!modified) return null;

  const label = new Date(`${modified}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <Text as="p" size="sm" emphasis="subtle" className="docs-last-updated">
      Last updated <time dateTime={modified}>{label}</time>
    </Text>
  );
}
